import { z } from 'zod'

/** 更新注册开关请求体 */
export const updateRegistrationOpenSchema = z.object({
  open: z.boolean(),
})

export type UpdateRegistrationOpenDto = z.infer<typeof updateRegistrationOpenSchema>
