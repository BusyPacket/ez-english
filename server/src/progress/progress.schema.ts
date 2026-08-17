import { z } from 'zod'

export const progressStatusSchema = z.enum(['todo', 'learning', 'learned', 'mastered'])

export const updateProgressSchema = z.object({
  status: progressStatusSchema,
})

export type UpdateProgressDto = z.infer<typeof updateProgressSchema>
