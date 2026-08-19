import { z } from 'zod'

/** 例题更新校验（admin 编辑） */
export const updateQuestionSchema = z.object({
  // 考点 id（来自共享大纲 allPointIds）
  pointId: z.string().min(1, '考点不能为空'),
  // 考点中文标题
  pointTitle: z.string().trim().min(1, '考点标题不能为空'),
  // 题型：目前仅 single（单选题），保留 fill/judge 枚举以兼容未来
  type: z.enum(['single', 'fill', 'judge']).default('single'),
  // 题干
  stem: z.string().min(1, '题干不能为空'),
  // 选项（单选 2-6 个）
  choices: z.array(z.string()).min(2, '至少两个选项').max(6).optional(),
  // 正确答案（选项字母 A-D）
  answer: z.string().min(1, '正确答案不能为空'),
  // 解析
  analysis: z.string().optional(),
})

export type UpdateQuestionDto = z.infer<typeof updateQuestionSchema>
