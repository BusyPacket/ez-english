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

/** 更新公共 AI 题目缓存上限 */
export const updateAiCacheLimitSchema = z.object({
  limit: z.number().int().min(0, '缓存上限不能小于 0').max(100, '缓存上限不能超过 100'),
})

export type UpdateAiCacheLimitDto = z.infer<typeof updateAiCacheLimitSchema>
