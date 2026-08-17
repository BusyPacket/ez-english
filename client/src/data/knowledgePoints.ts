export type KnowledgeStatus = 'todo' | 'learning' | 'learned' | 'mastered'

export const STATUS_OPTIONS: { label: string; value: KnowledgeStatus }[] = [
  { label: '待学习', value: 'todo' },
  { label: '学习中', value: 'learning' },
  { label: '已学习', value: 'learned' },
  { label: '已掌握', value: 'mastered' },
]

export interface KnowledgePoint {
  id: string
  title: string
}

export interface KnowledgeSection {
  id: string
  title: string
  points: KnowledgePoint[]
}

// 自动为板块内每个考点生成有序 id（如 vocabulary-1、sentence-2），无需手写序号
function toPoints(sectionId: string, points: Pick<KnowledgePoint, 'title'>[]): KnowledgePoint[] {
  return points.map((point, index) => ({ ...point, id: `${sectionId}-${index + 1}` }))
}

// 考试结构（题型与分值）：属考试说明，非学习考点，单独存放、不参与掌握进度统计
export const examStructure: KnowledgePoint[] = toPoints('exam-structure', [
  { title: '四选一（20 × 2，40 分）' },
  { title: '七选五（5 × 2，10 分）' },
  { title: '十五选十（10 × 1，10 分）' },
  { title: '完形填空（20 × 1，20 分）' },
  { title: '篇章问答（5 × 2，10 分）' },
  { title: '汉译英（5 × 3，15 分）' },
  { title: '英译汉（5 × 3，15 分）' },
  { title: '短文写作（1 × 30，30 分）' },
])

export const knowledgeSections: KnowledgeSection[] = [
  {
    id: 'vocabulary',
    title: '词汇',
    points: toPoints('vocabulary', [
      { title: '词性' },
      { title: '名词 n.' },
      { title: '限定词 det.' },
      { title: '代词 pron.' },
      { title: '冠词 art.' },
      { title: '数词 num.' },
      { title: '形容词 adj.' },
      { title: '副词 adv.' },
      { title: 'adj. adv. 三种级别' },
      { title: '介词 prep.' },
      { title: '连词 conj.' },
      { title: '动词 v.' },
      { title: '感叹词 int.' },
    ]),
  },
  {
    id: 'sentence',
    title: '句子',
    points: toPoints('sentence', [
      { title: '句子成分' },
      { title: '五种基本句型' },
      { title: '祈使句' },
      { title: 'There be' },
      { title: '造句与谓语动词' },
      { title: '并列谓语' },
      { title: '从句' },
      { title: '使役动词与 SVO' },
      { title: '时态' },
      { title: '语态' },
      { title: '感叹句' },
      { title: '疑问句（四大类）' },
      { title: '并列表语' },
      { title: '虚拟语气' },
      { title: '倒装句' },
      { title: '强调句' },
    ]),
  },
]

export const totalPointCount = knowledgeSections.reduce(
  (sum, section) => sum + section.points.length,
  0,
)
