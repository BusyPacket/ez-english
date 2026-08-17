import { z } from 'zod'

export const createFeedbackSchema = z.object({
  content: z.string().trim().min(1, '反馈内容不能为空').max(2000, '反馈内容不能超过 2000 字'),
})

export const feedbackStatusSchema = z.enum(['pending', 'resolved'])

export const updateFeedbackStatusSchema = z.object({
  status: feedbackStatusSchema,
})

export type CreateFeedbackDto = z.infer<typeof createFeedbackSchema>
export type UpdateFeedbackStatusDto = z.infer<typeof updateFeedbackStatusSchema>
