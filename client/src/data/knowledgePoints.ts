// 考点大纲与学习状态枚举已迁移到共享包 @ez-english/shared（前后端通用，英文 id）
// 此处 re-export，保持既有 import 路径不变

export {
  KnowledgeStatus,
  STATUS_OPTIONS,
  examStructure,
  knowledgeSections,
  totalPointCount,
} from '@ez-english/shared'
export type { KnowledgePoint, KnowledgeSection } from '@ez-english/shared'
