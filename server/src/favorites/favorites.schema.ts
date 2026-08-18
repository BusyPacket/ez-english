import { z } from 'zod'

/** 收藏一道 AI 生成题目 */
export const createFavoriteSchema = z.object({
  pointId: z.string().min(1),
  pointTitle: z.string().optional(),
  type: z.enum(['single', 'fill', 'judge']),
  stem: z.string().min(1),
  choices: z.array(z.string()).optional(),
  answer: z.string().min(1),
  analysis: z.string().optional(),
})

export type CreateFavoriteDto = z.infer<typeof createFavoriteSchema>
