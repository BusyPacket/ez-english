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
  /** 二级考点（词法细分等）；存在时本级作为分组标题，不计入掌握统计 */
  children?: KnowledgePoint[]
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
      {
        id: 'noun',
        title: '名词 n.',
        children: [
          { id: 'noun-count', title: '可数名词与不可数名词' },
          { id: 'noun-plural', title: '名词单复数变化' },
          { id: 'noun-measure', title: '不可数名词的计量（piece of 等）' },
          { id: 'noun-possessive', title: '名词所有格' },
        ],
      },
      {
        id: 'determiner',
        title: '限定词 det.',
        children: [
          { id: 'det-basic', title: '常用限定词（some/any/many/much 等）' },
          { id: 'det-quantifier', title: '数量限定词与可数/不可数搭配' },
          { id: 'det-order', title: '限定词的位置与排序（前/中/后位）' },
        ],
      },
      {
        id: 'pronoun',
        title: '代词 pron.',
        children: [
          { id: 'pron-personal', title: '人称代词与物主代词' },
          { id: 'pron-reflexive', title: '反身代词' },
          { id: 'pron-interrogative', title: '疑问代词（who/whom/whose 等）' },
          { id: 'pron-indefinite', title: '不定代词（复合不定代词）' },
          { id: 'pron-reciprocal', title: '相互代词（each other / one another）' },
          { id: 'pron-demonstrative', title: '指示代词' },
        ],
      },
      {
        id: 'article',
        title: '冠词 art.',
        children: [
          { id: 'article-indefinite', title: '不定冠词 a/an' },
          { id: 'article-definite', title: '定冠词 the' },
          { id: 'article-zero', title: '零冠词' },
        ],
      },
      {
        id: 'numeral',
        title: '数词 num.',
        children: [
          { id: 'num-cardinal', title: '基数词' },
          { id: 'num-ordinal', title: '序数词' },
          { id: 'num-expression', title: '分数、小数、日期与编号表达' },
          { id: 'num-arithmetic', title: '算术表达（plus/minus/equals 等）' },
        ],
      },
      {
        id: 'adjective',
        title: '形容词 adj.',
        children: [
          { id: 'adj-usage', title: '形容词作定语/表语' },
          { id: 'adj-order', title: '多个形容词的排列顺序' },
          { id: 'adj-conversion', title: '形容词与其他词类的转化' },
        ],
      },
      {
        id: 'adverb',
        title: '副词 adv.',
        children: [
          { id: 'adv-type', title: '副词分类（时间/地点/方式/程度/频率）' },
          { id: 'adv-usage', title: '副词的位置与用法' },
        ],
      },
      {
        id: 'degree',
        title: 'adj. adv. 三种级别',
        children: [
          { id: 'degree-comparative', title: '比较级' },
          { id: 'degree-superlative', title: '最高级' },
          { id: 'degree-equality', title: '同级比较与倍数表达' },
        ],
      },
      {
        id: 'preposition',
        title: '介词 prep.',
        children: [
          { id: 'prep-time', title: '时间介词' },
          { id: 'prep-place', title: '地点介词' },
          { id: 'prep-manner', title: '方式介词（by/with/through 等）' },
          { id: 'prep-reason', title: '原因介词（for/because of）' },
          { id: 'prep-collocation', title: '常用介词搭配（动+介 / 形+介）' },
        ],
      },
      {
        id: 'conjunction',
        title: '连词 conj.',
        children: [
          { id: 'conj-coordinating', title: '并列连词（and/but/or/so）' },
          { id: 'conj-subordinating', title: '从属连词（引导从句）' },
        ],
      },
      {
        id: 'verb',
        title: '动词 v.',
        children: [
          { id: 'verb-transitive', title: '及物动词与不及物动词' },
          { id: 'verb-link', title: '系动词' },
          { id: 'verb-auxiliary', title: '助动词与情态动词' },
          { id: 'verb-durative', title: '延续性动词与瞬时性动词' },
          { id: 'verb-nonfinite', title: '非谓语动词（不定式/动名词/分词）' },
          { id: 'verb-phrasal', title: '短语动词与固定搭配' },
        ],
      },
      {
        id: 'interjection',
        title: '感叹词 int.',
        children: [{ id: 'int-basic', title: '常用感叹词与用法（oh/well/ah 等）' }],
      },
    ],
  },
  {
    id: 'sentence',
    title: '句子',
    points: [
      {
        id: 'sentence-structure',
        title: '句子结构与成分',
        children: [
          { id: 'sentence-elements', title: '句子成分' },
          { id: 'five-basic-patterns', title: '五种基本句型' },
          { id: 'subject-verb-agreement', title: '主谓一致' },
          { id: 'predicate-verb', title: '造句与谓语动词' },
          { id: 'compound-predicate', title: '并列谓语' },
          { id: 'compound-predicative', title: '并列表语' },
        ],
      },
      {
        id: 'tense-voice',
        title: '时态与语态',
        children: [
          { id: 'tense-simple', title: '一般时态（现在/过去/将来）' },
          { id: 'tense-progressive', title: '进行时态' },
          { id: 'tense-perfect', title: '完成时态' },
          { id: 'voice', title: '被动语态' },
        ],
      },
      {
        id: 'clause',
        title: '从句',
        children: [
          { id: 'clause-nominal', title: '名词性从句（主/宾/表/同位语）' },
          { id: 'clause-attributive', title: '定语从句' },
          { id: 'clause-adverbial', title: '状语从句' },
        ],
      },
      {
        id: 'special-sentences',
        title: '特殊句型',
        children: [
          { id: 'imperative', title: '祈使句' },
          { id: 'there-be', title: 'There be 句型' },
          { id: 'exclamatory', title: '感叹句' },
          { id: 'question-types', title: '疑问句（四大类）' },
          { id: 'causative-verb', title: '使役动词与主谓宾' },
          { id: 'subjunctive', title: '虚拟语气' },
          { id: 'inversion', title: '倒装句' },
          { id: 'emphasis', title: '强调句' },
        ],
      },
    ],
  },
]

/** 统计叶子考点数（有 children 的分组不计入） */
function countLeaves(points: KnowledgePoint[]): number {
  return points.reduce((sum, p) => sum + (p.children?.length ? countLeaves(p.children) : 1), 0)
}

export const totalPointCount = knowledgeSections.reduce(
  (sum, section) => sum + countLeaves(section.points),
  0,
)

/** 全部叶子考点 id（供后端按合法考点过滤统计，忽略历史孤儿记录） */
export const allPointIds: string[] = knowledgeSections.flatMap((section) => {
  const collect = (points: KnowledgePoint[]): string[] =>
    points.flatMap((p) => (p.children?.length ? collect(p.children) : [p.id]))
  return collect(section.points)
})
