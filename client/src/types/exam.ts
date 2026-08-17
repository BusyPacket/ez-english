export interface ExamQuestion {
  no: number
  stem: string
  choices?: string[] // 选项文本，对应 A/B/C/D
}

export interface ExamPassage {
  title: string
  content: string
  questions: ExamQuestion[]
}

export interface ExamBlock {
  id: string
  title: string
  score: string
  directions?: string
  passages?: ExamPassage[]
  questions?: ExamQuestion[]
  optionBank?: string[] // 七选五 A-G / 选词填空 A-O
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

