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

/** 练习生成请求体：考点 + 题型 */
export const generatePracticeSchema = z.object({
  point: z.string().min(1),
  type: z.enum(['single', 'fill', 'judge']),
})

export type GeneratePracticeDto = z.infer<typeof generatePracticeSchema>

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
