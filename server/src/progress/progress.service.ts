import { Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { KnowledgeStatus, totalPointCount } from '@ez-english/shared'
import { db, schema } from '../database/database'
import type { UpdateProgressDto } from './progress.schema'

@Injectable()
export class ProgressService {
  /** 查询某用户的全部学习进度 */
  async getAll(userId: string) {
    return db
      .select()
      .from(schema.progress)
      .where(eq(schema.progress.userId, userId))
      .orderBy(schema.progress.pointId)
      .all()
  }

  /** 写入/更新某用户某个考点状态（upsert） */
  async upsert(userId: string, pointId: string, dto: UpdateProgressDto) {
    const updatedAt = new Date().toISOString()
    await db
      .insert(schema.progress)
      .values({ userId, pointId, status: dto.status, updatedAt })
      .onConflictDoUpdate({
        target: [schema.progress.userId, schema.progress.pointId],
        set: { status: dto.status, updatedAt },
      })
      .run()
    return { userId, pointId, status: dto.status, updatedAt }
  }

  /** 学习进度汇总：各状态计数 + 已掌握百分比（后端计算） */
  async getSummary(userId: string) {
    const rows = await db
      .select()
      .from(schema.progress)
      .where(eq(schema.progress.userId, userId))
      .all()

    // 无记录默认待学习（todo）；有记录则计入对应状态并从未完成数中扣除
    const counts: Record<string, number> = {
      [KnowledgeStatus.Todo]: totalPointCount,
      [KnowledgeStatus.Learning]: 0,
      [KnowledgeStatus.Learned]: 0,
      [KnowledgeStatus.Mastered]: 0,
    }
    for (const row of rows) {
      const s = row.status as KnowledgeStatus
      if (counts[s] !== undefined) {
        counts[s]++
        if (s !== KnowledgeStatus.Todo) counts[KnowledgeStatus.Todo]--
      }
    }

    // 进度百分比：只统计「已掌握」
    const masteredPercent = Math.round((counts[KnowledgeStatus.Mastered] / totalPointCount) * 100)

    return { total: totalPointCount, counts, masteredPercent }
  }
}
