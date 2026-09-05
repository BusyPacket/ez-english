import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { DeepSeekClient, type ChatMessage } from './deepseek'
import { ProfileService } from '../users/profile.service'
import { QuestionsService } from '../questions/questions.service'
import { UserService } from '../users/user.service'
import {
  GENERATE_QUESTION_SYSTEM_PROMPT,
  GENERATE_WRITING_SYSTEM_PROMPT,
  generatePracticeSystemPrompt,
  REVIEW_WRITING_SYSTEM_PROMPT,
} from './prompts'
import {
  generatedQuestionSchema,
  type GenerateFollowUpDto,
  type GeneratePracticeDto,
  type GenerateQuestionDto,
  type GenerateWritingDto,
  type GeneratedQuestion,
  type ReviewWritingDto,
} from './ai.schema'

/** 生成前余额检查阈值（元）：余额低于此值阻止生成 */
const MIN_BALANCE = 0.5

@Injectable()
export class AiService {
  constructor(
    private readonly deepseek: DeepSeekClient,
    private readonly profileService: ProfileService,
    private readonly userService: UserService,
    private readonly questionsService: QuestionsService,
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

  /** 按考点与题型生成一道练习例题（带去重：提示已有题 + 相似度校验 + 有限重试） */
  async generatePractice(userId: string, dto: GeneratePracticeDto): Promise<GeneratedQuestion> {
    await this.assertTrialAvailable(userId)
    const { apiKey, model } = await this.profileService.getChatConfig(userId)
    await this.profileService.assertSufficientBalance(userId, MIN_BALANCE)

    const typeLabel = { single: '单选题', fill: '填空题', judge: '判断题' }[dto.type]

    // 去重源：题库里该考点已有的题干（最近 20 条）+ 前端传入的本次会话已生成题干
    const existing: string[] = []
    try {
      const bank = await this.questionsService.list('', dto.point, 30)
      for (const q of bank) {
        if (q.stem && existing.length < 20) existing.push(q.stem)
      }
    } catch {
      // 题库查询失败不阻塞生成
    }
    if (dto.excludeStems) {
      for (const s of dto.excludeStems) {
        const t = s?.trim()
        if (t && !existing.includes(t) && existing.length < 30) existing.push(t)
      }
    }

    // 有限重试：最多生成 MAX_RETRY + 1 次；命中重复则把该题干加入排除列表后重新出题
    const MAX_RETRY = 2
    let lastQuestion: GeneratedQuestion | null = null
    for (let attempt = 0; attempt <= MAX_RETRY; attempt++) {
      const raw = await this.deepseek.chat(apiKey, model, [
        {
          role: 'system',
          content: generatePracticeSystemPrompt(dto.point, typeLabel, existing),
        },
      ])
      const question = this.parseJson(raw)
      const result = generatedQuestionSchema.safeParse(question)
      if (!result.success) {
        if (attempt < MAX_RETRY) continue
        throw new InternalServerErrorException('AI 返回的题目格式不符合预期')
      }
      lastQuestion = result.data
      if (!this.isDuplicateStem(lastQuestion.stem, existing)) {
        return lastQuestion
      }
      existing.push(lastQuestion.stem)
    }
    // 重试耗尽仍重复：返回最后一道，避免无谓报错（prompt 已尽量规避）
    return lastQuestion as GeneratedQuestion
  }

  /** 题干是否与已有题重复：归一化后完全相等或 Levenshtein 相似度 ≥ 阈值 */
  private isDuplicateStem(stem: string, existing: string[]): boolean {
    const norm = (s: string) =>
      s.toLowerCase().replace(/[\s_＿—\-－~～，。！？、,.;:!?()（）【】[\]“”"''“”]/g, '')
    const target = norm(stem)
    if (!target) return false
    for (const e of existing) {
      const en = norm(e)
      if (!en) continue
      if (en === target) return true
      if (target.length * en.length > 20000) continue // 超长跳过相似度，避免开销
      if (this.levenshteinRatio(target, en) >= 0.85) return true
    }
    return false
  }

  /** 归一化字符串的 Levenshtein 相似度（1 - 编辑距离/较长串长度） */
  private levenshteinRatio(a: string, b: string): number {
    if (a.length < b.length) {
      const t = a
      a = b
      b = t
    }
    let prev = Array.from({ length: b.length + 1 }, (_, j) => j)
    let curr = Array.from<number>({ length: b.length + 1 })
    for (let i = 1; i <= a.length; i++) {
      curr[0] = i
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1
        curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost)
      }
      const t = prev
      prev = curr
      curr = t
    }
    return 1 - prev[b.length] / Math.max(a.length, b.length)
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

  /** 生成一道专升本作文题（写作练习页） */
  async generateWriting(
    userId: string,
    dto: GenerateWritingDto,
  ): Promise<{ stem: string; analysis: string | null }> {
    await this.assertTrialAvailable(userId)
    const { apiKey, model } = await this.profileService.getChatConfig(userId)
    await this.profileService.assertSufficientBalance(userId, MIN_BALANCE)

    const raw = await this.deepseek.chat(apiKey, model, [
      { role: 'system', content: GENERATE_WRITING_SYSTEM_PROMPT },
      { role: 'user', content: `写作考点：${dto.point}` },
    ])
    const parsed = this.parseJson(raw) as { stem?: string; analysis?: string }
    return { stem: parsed.stem ?? '', analysis: parsed.analysis ?? null }
  }

  /** 点评英语作文（写作练习页） */
  async reviewWriting(userId: string, dto: ReviewWritingDto): Promise<{ reply: string }> {
    await this.assertTrialAvailable(userId)
    const { apiKey, model } = await this.profileService.getChatConfig(userId)
    await this.profileService.assertSufficientBalance(userId, MIN_BALANCE)

    const userContent = `作文题目：${dto.topic ?? '未提供'}\n\n学生作文：\n${dto.essay}`
    const reply = await this.deepseek.chat(
      apiKey,
      model,
      [
        { role: 'system', content: REVIEW_WRITING_SYSTEM_PROMPT },
        { role: 'user', content: userContent },
      ],
      { jsonMode: false },
    )
    return { reply }
  }

  /** 流式点评英语作文。 */
  async *streamReviewWriting(userId: string, dto: ReviewWritingDto): AsyncGenerator<string> {
    await this.assertTrialAvailable(userId)
    const { apiKey, model } = await this.profileService.getChatConfig(userId)
    await this.profileService.assertSufficientBalance(userId, MIN_BALANCE)
    const userContent = `作文题目：${dto.topic ?? '未提供'}\n\n学生作文：\n${dto.essay}`
    yield* this.deepseek.chatStream(apiKey, model, [
      { role: 'system', content: REVIEW_WRITING_SYSTEM_PROMPT },
      { role: 'user', content: userContent },
    ])
  }

  /** 流式追问。 */
  async *streamFollowUp(userId: string, dto: GenerateFollowUpDto): AsyncGenerator<string> {
    await this.assertTrialAvailable(userId)
    const { apiKey, model } = await this.profileService.getChatConfig(userId)
    await this.profileService.assertSufficientBalance(userId, MIN_BALANCE)
    const typeLabel = { single: '单选题', fill: '填空题', judge: '判断题' }[dto.type]
    yield* this.deepseek.chatStream(apiKey, model, [
      { role: 'system', content: generatePracticeSystemPrompt(dto.point, typeLabel) },
      ...dto.history,
      { role: 'user', content: dto.question },
    ])
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
