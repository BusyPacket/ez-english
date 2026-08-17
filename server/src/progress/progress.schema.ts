import { z } from 'zod'
import { KnowledgeStatus } from '@ez-english/shared'

export const progressStatusSchema = z.enum([
  KnowledgeStatus.Todo,
  KnowledgeStatus.Learning,
  KnowledgeStatus.Learned,
  KnowledgeStatus.Mastered,
])

export const updateProgressSchema = z.object({
  status: progressStatusSchema,
})

export type UpdateProgressDto = z.infer<typeof updateProgressSchema>
