import { Injectable, NotFoundException } from '@nestjs/common'
import { desc, eq } from 'drizzle-orm'
import { db, schema } from '../database/database'
import type { Question } from '../database/schema'

/** 数据库行 → API 响应（choices 反序列化为数组） */
function mapRow(row: Question) {
  return {
    id: row.id,
    type: row.type,
    pointId: row.pointId,
    pointTitle: row.pointTitle,
    stem: row.stem,
    choices: row.choices ? (JSON.parse(row.choices) as string[]) : [],
    answer: row.answer,
    analysis: row.analysis,
    createdAt: row.createdAt,
  }
}

@Injectable()
export class QuestionsService {
  /** 例题列表；可按考点过滤、限制数量（默认全部，按创建时间倒序） */
  async list(pointId?: string, limit?: number) {
    const base = pointId
      ? db
          .select()
          .from(schema.questions)
          .where(eq(schema.questions.pointId, pointId))
          .orderBy(desc(schema.questions.createdAt))
      : db.select().from(schema.questions).orderBy(desc(schema.questions.createdAt))

    const size = Math.max(0, Math.min(limit ?? 100, 100))
    const rows = await base.limit(size).all()
    return rows.map(mapRow)
  }

  /** 随机抽取 N 道题（供练习抽题，可限定考点） */
  async random(limit: number, pointId?: string) {
    const size = Math.max(1, Math.min(limit || 10, 50))
    const rows = pointId
      ? await db
          .select()
          .from(schema.questions)
          .where(eq(schema.questions.pointId, pointId))
          .orderBy(desc(schema.questions.createdAt))
          .all()
      : await db.select().from(schema.questions).orderBy(desc(schema.questions.createdAt)).all()

    // 随机打乱后取前 N 道
    const shuffled = [...rows].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, size).map(mapRow)
  }

  /** 题目详情 */
  async findOne(id: string) {
    const row = await db.select().from(schema.questions).where(eq(schema.questions.id, id)).get()
    if (!row) {
      throw new NotFoundException('题目不存在')
    }
    return mapRow(row)
  }
}
