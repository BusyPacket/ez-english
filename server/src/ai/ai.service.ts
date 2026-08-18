import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { DeepSeekClient } from './deepseek'
import { ProfileService } from '../users/profile.service'
import { GENERATE_QUESTION_SYSTEM_PROMPT } from './prompts'
import {
  generatedQuestionSchema,
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
  ) {}

  /** 根据参考例题，用当前用户配置的 DeepSeek key 生成一道同类题目 */
  async generateQuestion(userId: string, dto: GenerateQuestionDto): Promise<GeneratedQuestion> {
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
