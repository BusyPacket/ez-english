import { z } from 'zod'

/** 参考例题：兼容阅读题（含 context）与独立选择题（无 context） */
export const exampleQuestionSchema = z.object({
  stem: z.string(),
  choices: z.array(z.string()).optional(),
  answer: z.string(),
  point: z.string().optional(),
  analysis: z.string().optional(),
  context: z.string().optional(),
})

export type ExampleQuestion = z.infer<typeof exampleQuestionSchema>

/** 生成题目的请求体 */
export const generateQuestionSchema = z.object({
  example: exampleQuestionSchema,
})

export type GenerateQuestionDto = z.infer<typeof generateQuestionSchema>

/** 练习生成请求体：考点 + 题型（可选：本次会话已生成过的题干，用于去重） */
export const generatePracticeSchema = z.object({
  point: z.string().min(1),
  type: z.enum(['single', 'fill', 'judge']),
  excludeStems: z.array(z.string()).optional(),
})

export type GeneratePracticeDto = z.infer<typeof generatePracticeSchema>

/** 追问消息（多轮对话历史） */
export const followUpMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
})

/** 追问请求体：考点 + 题型 + 历史消息 + 新问题 */
export const generateFollowUpSchema = z.object({
  point: z.string().min(1),
  type: z.enum(['single', 'fill', 'judge']),
  history: z.array(followUpMessageSchema),
  question: z.string().min(1),
})

export type FollowUpMessage = z.infer<typeof followUpMessageSchema>
export type GenerateFollowUpDto = z.infer<typeof generateFollowUpSchema>

/** 校验 AI 返回的题目（服务端兜底，防止模型自由发挥字段名） */
export const generatedQuestionSchema = z.object({
  stem: z.string(),
  choices: z.array(z.string()).optional(),
  answer: z.string(),
  point: z.string().optional(),
  analysis: z.string().optional(),
  context: z.string().optional(),
})

export type GeneratedQuestion = z.infer<typeof generatedQuestionSchema>

/** 生成作文题请求体（写作练习页） */
export const generateWritingSchema = z.object({
  point: z.string().min(1, '写作考点不能为空'),
})
export type GenerateWritingDto = z.infer<typeof generateWritingSchema>

/** 作文点评请求体（写作练习页） */
export const reviewWritingSchema = z.object({
  essay: z.string().min(1, '作文不能为空'),
  topic: z.string().optional(),
})
export type ReviewWritingDto = z.infer<typeof reviewWritingSchema>
