import { Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import {
  allPointIds,
  displayName,
  KnowledgeStatus,
  maskEmail,
  totalPointCount,
} from '@ez-english/shared'
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
  // 统计口径基于 @ez-english/shared 的 totalPointCount 与 allPointIds（叶子考点）
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
    const validIds = new Set(allPointIds)
    for (const row of rows) {
      if (!validIds.has(row.pointId)) continue // 忽略历史孤儿记录
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

  /** 学习进度排行榜：按已掌握数降序（排除管理员），昵称优先、邮箱脱敏 */
  async getLeaderboard() {
    const users = await db.select().from(schema.users).all()
    const rows = await db.select().from(schema.progress).all()

    // 统计每个用户的已掌握考点数（只算合法叶子考点，忽略历史孤儿记录）
    const validIds = new Set(allPointIds)
    const masteredByUser = new Map<string, number>()
    for (const row of rows) {
      if (row.status === KnowledgeStatus.Mastered && validIds.has(row.pointId)) {
        masteredByUser.set(row.userId, (masteredByUser.get(row.userId) ?? 0) + 1)
      }
    }

    const list = users.map((user) => {
      const masteredCount = masteredByUser.get(user.id) ?? 0
      const percent = Math.round((masteredCount / totalPointCount) * 100)
      return {
        userId: user.id,
        name: displayName(user.nickname, user.email),
        maskedEmail: maskEmail(user.email),
        masteredCount,
        percent,
      }
    })

    // 按已掌握数降序，并列时按用户 id 稳定排序
    list.sort((a, b) => b.masteredCount - a.masteredCount || a.userId.localeCompare(b.userId))

    return list.map((item, index) => ({ rank: index + 1, ...item }))
  }
}
