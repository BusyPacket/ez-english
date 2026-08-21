import { z } from 'zod'

/** 更新注册开关请求体 */
export const updateRegistrationOpenSchema = z.object({
  open: z.boolean(),
})

export type UpdateRegistrationOpenDto = z.infer<typeof updateRegistrationOpenSchema>

/** 更新免费试用天数请求体 */
export const updateTrialDaysSchema = z.object({
  days: z.number().int().min(1, '试用天数至少为 1 天').max(365, '试用天数不能超过 365 天'),
})

export type UpdateTrialDaysDto = z.infer<typeof updateTrialDaysSchema>
