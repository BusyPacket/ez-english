import { Injectable, NotFoundException } from '@nestjs/common'
import { and, desc, eq, like, or, sql, type SQL } from 'drizzle-orm'
import { db, schema } from '../database/database'
import type { Question } from '../database/schema'
import type { UpdateQuestionDto } from './questions.schema'

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

  /** 例题管理分页列表（admin）：预览考点/类型/题目前 20 字；支持关键词与考点筛选 */
  async adminList(page: number, pageSize: number, keyword?: string, pointId?: string) {
    const size = Math.max(1, Math.min(pageSize || 10, 100))
    const offset = (Math.max(1, page || 1) - 1) * size
    const kw = keyword?.trim()
    const conds: SQL[] = []
    if (kw) {
      const kwCond = or(
        like(schema.questions.stem, `%${kw}%`),
        like(schema.questions.pointTitle, `%${kw}%`),
      )
      if (kwCond) conds.push(kwCond)
    }
    if (pointId) conds.push(eq(schema.questions.pointId, pointId))
    const where = conds.length ? and(...conds) : undefined

    const totalRow = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.questions)
      .where(where)
      .get()
    const total = Number(totalRow?.count ?? 0)

    const rows = await db
      .select()
      .from(schema.questions)
      .where(where)
      .orderBy(desc(schema.questions.createdAt))
      .limit(size)
      .offset(offset)
      .all()

    return {
      items: rows.map((r) => ({
        id: r.id,
        pointId: r.pointId,
        pointTitle: r.pointTitle,
        type: r.type,
        stemPreview: r.stem.length > 20 ? `${r.stem.slice(0, 20)}…` : r.stem,
      })),
      total,
      page: Math.max(1, page || 1),
      pageSize: size,
    }
  }

  /** 更新例题（admin 编辑） */
  async update(id: string, dto: UpdateQuestionDto) {
    const existing = await db
      .select()
      .from(schema.questions)
      .where(eq(schema.questions.id, id))
      .get()
    if (!existing) {
      throw new NotFoundException('题目不存在')
    }
    await db
      .update(schema.questions)
      .set({
        pointId: dto.pointId,
        pointTitle: dto.pointTitle,
        type: dto.type,
        stem: dto.stem,
        choices: dto.choices?.length ? JSON.stringify(dto.choices) : existing.choices,
        answer: dto.answer,
        analysis: dto.analysis?.trim() ? dto.analysis : null,
      })
      .where(eq(schema.questions.id, id))
      .run()
    return this.findOne(id)
  }

  /** 删除例题（admin） */
  async remove(id: string) {
    const result = await db.delete(schema.questions).where(eq(schema.questions.id, id)).run()
    if (result.rowsAffected === 0) {
      throw new NotFoundException('题目不存在')
    }
    return { id }
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
