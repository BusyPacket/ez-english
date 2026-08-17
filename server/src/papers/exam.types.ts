export interface ExamQuestion {
  no: number
  stem: string
  choices?: string[] // 选项文本，对应 A/B/C/D
  answer?: string // 参考答案：选择题为选项字母，翻译/问答/写作为文本
}

export interface ExamPassage {
  title: string
  content: string
  questions: ExamQuestion[]
}

export interface ExamBlock {
  id: string
  type?: string // 题型：四选一 / 七选五 / 选词填空 / 完形填空 / 篇章问答 / 汉译英 / 英译汉 / 短文写作
  title: string
  score: string
  directions?: string
  passages?: ExamPassage[]
  questions?: ExamQuestion[]
  optionBank?: string[] // 七选五 A-G / 选词填空 A-O
  answers?: string // 无独立题号题型（七选五/选词填空）的答案说明
}

export interface ExamPart {
  id: string
  title: string
  score: string
  blocks: ExamBlock[]
}

export interface ExamPaper {
  year: number
  title: string
  parts: ExamPart[]
}
