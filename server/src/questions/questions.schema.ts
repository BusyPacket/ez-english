import { z } from 'zod'

/** 例题更新校验（admin 编辑） */
export const updateQuestionSchema = z
  .object({
    // 考点 id（来自共享大纲 allPointIds）
    pointId: z.string().min(1, '考点不能为空'),
    // 考点中文标题
    pointTitle: z.string().trim().min(1, '考点标题不能为空'),
    // 题型：single 单选 / fill 填空 / judge 判断
    type: z.enum(['single', 'fill', 'judge']).default('single'),
    // 题干
    stem: z.string().min(1, '题干不能为空'),
    // 选项（仅单选题需要，2-6 个；填空/判断题无选项）
    choices: z.array(z.string()).max(6).optional(),
    // 正确答案：单选为选项字母 A-D，判断为「正确/错误」，填空为答案文本
    answer: z.string().min(1, '正确答案不能为空'),
    // 解析
    analysis: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.type === 'single') {
      const filled = (val.choices ?? []).map((c) => c.trim()).filter(Boolean)
      if (filled.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['choices'],
          message: '单选题至少需要两个选项',
        })
      }
    }
  })

export type UpdateQuestionDto = z.infer<typeof updateQuestionSchema>

/** 例题新增校验（admin 添加）——字段与更新一致 */
export const createQuestionSchema = updateQuestionSchema
export type CreateQuestionDto = z.infer<typeof createQuestionSchema>

/** 记录答题校验（用户作答例题库题目） */
export const recordAnswerSchema = z.object({
  // 题目 id（关联 questions.id）
  questionId: z.string().min(1, '题目不能为空'),
  // 题型：single 单选 / fill 填空 / judge 判断
  type: z.enum(['single', 'fill', 'judge']),
  // 用户选择的答案：单选为选项字母（如 A），判断为「正确/错误」，填空为用户输入文本
  userAnswer: z.string().min(1, '答案不能为空'),
  // 是否答对
  isCorrect: z.boolean(),
})

export type RecordAnswerDto = z.infer<typeof recordAnswerSchema>
