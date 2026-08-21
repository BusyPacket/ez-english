import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { DeepSeekClient, type ChatMessage } from './deepseek'
import { ProfileService } from '../users/profile.service'
import { UserService } from '../users/user.service'
import { GENERATE_QUESTION_SYSTEM_PROMPT, generatePracticeSystemPrompt } from './prompts'
import {
  generatedQuestionSchema,
  type GenerateFollowUpDto,
  type GeneratePracticeDto,
  type GenerateQuestionDto,
  type GeneratedQuestion,
} from './ai.schema'

/** 生成前余额检查阈值（元）：余额低于此值阻止生成 */
const MIN_BALANCE = 0.5

@Injectable()
export class AiService {
  constructor(
    private readonly deepseek: DeepSeekClient,
    private readonly profileService: ProfileService,
    private readonly userService: UserService,
  ) {}

  /** 试用期检查：普通用户试用期已到则禁止使用 AI（会员/管理员豁免） */
  private async assertTrialAvailable(userId: string) {
    if (await this.userService.isTrialExpired(userId)) {
      throw new ForbiddenException('7 天试用期已到，请联系管理员升级会员以继续使用 AI 功能')
    }
  }

  /** 根据参考例题，用当前用户配置的 DeepSeek key 生成一道同类题目 */
  async generateQuestion(userId: string, dto: GenerateQuestionDto): Promise<GeneratedQuestion> {
    await this.assertTrialAvailable(userId)
    const { apiKey, model } = await this.profileService.getChatConfig(userId)
    // 生成前检查余额，低于阈值（0.5 元）时阻止生成并提示
    await this.profileService.assertSufficientBalance(userId, MIN_BALANCE)
    const userContent = `参考例题：\n${JSON.stringify(dto.example, null, 2)}`

    const raw = await this.deepseek.chat(apiKey, model, [
      { role: 'system', content: GENERATE_QUESTION_SYSTEM_PROMPT },
      { role: 'user', content: userContent },
    ])

    const question = this.parseJson(raw)
    const result = generatedQuestionSchema.safeParse(question)
    if (!result.success) {
      throw new InternalServerErrorException('AI 返回的题目格式不符合预期')
    }
    return result.data
  }

  /** 按考点与题型生成一道练习例题 */
  async generatePractice(userId: string, dto: GeneratePracticeDto): Promise<GeneratedQuestion> {
    await this.assertTrialAvailable(userId)
    const { apiKey, model } = await this.profileService.getChatConfig(userId)
    await this.profileService.assertSufficientBalance(userId, MIN_BALANCE)

    const typeLabel = { single: '单选题', fill: '填空题', judge: '判断题' }[dto.type]
    const raw = await this.deepseek.chat(apiKey, model, [
      { role: 'system', content: generatePracticeSystemPrompt(dto.point, typeLabel) },
    ])

    const question = this.parseJson(raw)
    const result = generatedQuestionSchema.safeParse(question)
    if (!result.success) {
      throw new InternalServerErrorException('AI 返回的题目格式不符合预期')
    }
    return result.data
  }

  /** 追问：携带此前多轮上下文，回答用户新问题 */
  async generateFollowUp(userId: string, dto: GenerateFollowUpDto): Promise<{ reply: string }> {
    await this.assertTrialAvailable(userId)
    const { apiKey, model } = await this.profileService.getChatConfig(userId)
    await this.profileService.assertSufficientBalance(userId, MIN_BALANCE)

    const typeLabel = { single: '单选题', fill: '填空题', judge: '判断题' }[dto.type]
    const messages: ChatMessage[] = [
      { role: 'system', content: generatePracticeSystemPrompt(dto.point, typeLabel) },
      ...dto.history,
      { role: 'user', content: dto.question },
    ]
    const reply = await this.deepseek.chat(apiKey, model, messages, { jsonMode: false })
    return { reply }
  }

  /** 解析模型返回文本为 JSON，兼容 ```json ``` 代码块包裹 */
  private parseJson(raw: string): unknown {
    const trimmed = raw.trim()
    try {
      return JSON.parse(trimmed)
    } catch {
      const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (match) {
        return JSON.parse(match[1].trim())
      }
      throw new InternalServerErrorException('AI 返回内容不是合法 JSON')
    }
  }
}
