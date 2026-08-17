// 前后端共享：学习状态枚举 + 考点大纲（唯一英文 id）
// 由 @ez-english/shared 统一提供，前端、后端均从这里 import

/** 学习状态枚举（值即数据库存储值） */
export enum KnowledgeStatus {
  Todo = 'todo',
  Learning = 'learning',
  Learned = 'learned',
  Mastered = 'mastered',
}

export const STATUS_OPTIONS: { label: string; value: KnowledgeStatus }[] = [
  { label: '待学习', value: KnowledgeStatus.Todo },
  { label: '学习中', value: KnowledgeStatus.Learning },
  { label: '已学习', value: KnowledgeStatus.Learned },
  { label: '已掌握', value: KnowledgeStatus.Mastered },
]

/** 邮箱脱敏：保留前 2 位，中间用星号代替（如 fr******@example.com）。前后端通用 */
export function maskEmail(email: string): string {
  const atIndex = email.indexOf('@')
  if (atIndex <= 1) return email
  const local = email.slice(0, atIndex)
  const domain = email.slice(atIndex)
  const visible = local.slice(0, 2)
  return `${visible}${'*'.repeat(Math.max(local.length - visible.length, 4))}${domain}`
}

/** 展示名：昵称优先，否则用脱敏邮箱。前后端通用 */
export function displayName(nickname: string | null | undefined, email: string): string {
  return nickname?.trim() ? nickname : maskEmail(email)
}

export interface KnowledgePoint {
  id: string
  title: string
}

export interface KnowledgeSection {
  id: string
  title: string
  points: KnowledgePoint[]
}

// 考试结构（题型与分值）：属考试说明，非学习考点，不参与掌握进度统计
export const examStructure: KnowledgePoint[] = [
  { id: 'structure-reading-choice', title: '四选一（20 × 2，40 分）' },
  { id: 'structure-gap-5', title: '七选五（5 × 2，10 分）' },
  { id: 'structure-banked-10', title: '十五选十（10 × 1，10 分）' },
  { id: 'structure-cloze-20', title: '完形填空（20 × 1，20 分）' },
  { id: 'structure-short-answer', title: '篇章问答（5 × 2，10 分）' },
  { id: 'structure-cn2en', title: '汉译英（5 × 3，15 分）' },
  { id: 'structure-en2cn', title: '英译汉（5 × 3，15 分）' },
  { id: 'structure-writing', title: '短文写作（1 × 30，30 分）' },
]

// 学习考点大纲
export const knowledgeSections: KnowledgeSection[] = [
  {
    id: 'vocabulary',
    title: '词汇',
    points: [
      { id: 'noun', title: '名词 n.' },
      { id: 'determiner', title: '限定词 det.' },
      { id: 'pronoun', title: '代词 pron.' },
      { id: 'article', title: '冠词 art.' },
      { id: 'numeral', title: '数词 num.' },
      { id: 'adjective', title: '形容词 adj.' },
      { id: 'adverb', title: '副词 adv.' },
      { id: 'degree', title: 'adj. adv. 三种级别' },
      { id: 'preposition', title: '介词 prep.' },
      { id: 'conjunction', title: '连词 conj.' },
      { id: 'verb', title: '动词 v.' },
      { id: 'interjection', title: '感叹词 int.' },
    ],
  },
  {
    id: 'sentence',
    title: '句子',
    points: [
      { id: 'sentence-elements', title: '句子成分' },
      { id: 'five-basic-patterns', title: '五种基本句型' },
      { id: 'imperative', title: '祈使句' },
      { id: 'there-be', title: 'There be' },
      { id: 'predicate-verb', title: '造句与谓语动词' },
      { id: 'compound-predicate', title: '并列谓语' },
      { id: 'clause', title: '从句' },
      { id: 'causative-verb', title: '使役动词与主谓宾' },
      { id: 'tense', title: '时态' },
      { id: 'voice', title: '语态' },
      { id: 'exclamatory', title: '感叹句' },
      { id: 'question-types', title: '疑问句（四大类）' },
      { id: 'compound-predicative', title: '并列表语' },
      { id: 'subjunctive', title: '虚拟语气' },
      { id: 'inversion', title: '倒装句' },
      { id: 'emphasis', title: '强调句' },
    ],
  },
]

export const totalPointCount = knowledgeSections.reduce(
  (sum, section) => sum + section.points.length,
  0,
)
