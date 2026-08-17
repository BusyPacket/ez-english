import { Injectable, NotFoundException } from '@nestjs/common'
import { examPaper2025 } from './examPaper2025'
import type { ExamPaper } from './exam.types'

// 未来新增年份：在此数组追加即可
const papers: ExamPaper[] = [examPaper2025]

@Injectable()
export class PapersService {
  getAllYears() {
    return papers.map((p) => ({ year: p.year, title: p.title }))
  }

  getPaper(year: number): ExamPaper {
    const paper = papers.find((p) => p.year === year)
    if (!paper) {
      throw new NotFoundException(`未找到 ${year} 年真题`)
    }
    return paper
  }
}
