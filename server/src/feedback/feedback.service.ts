import { Injectable, NotFoundException } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { desc, eq } from 'drizzle-orm'
import { db, schema } from '../database/database'
import type { CreateFeedbackDto } from './feedback.schema'
import type { feedbackStatusSchema } from './feedback.schema'
import type { z } from 'zod'

type FeedbackStatus = z.infer<typeof feedbackStatusSchema>

@Injectable()
export class FeedbackService {
  /** 创建一条反馈（初始状态为未处理 pending） */
  async create(userId: string, dto: CreateFeedbackDto) {
    const row = {
      id: randomUUID(),
      userId,
      content: dto.content,
      status: 'pending' as FeedbackStatus,
      createdAt: new Date().toISOString(),
    }
    await db.insert(schema.feedback).values(row).run()
    return row
  }

  /** 查询某个用户提交的全部反馈（按时间倒序） */
  async listByUser(userId: string) {
    return db
      .select()
      .from(schema.feedback)
      .where(eq(schema.feedback.userId, userId))
      .orderBy(desc(schema.feedback.createdAt))
      .all()
  }

  /** 查询全部反馈（含提交者邮箱，按时间倒序）—— 管理员 */
  async listAll() {
    return db
      .select({
        id: schema.feedback.id,
        userId: schema.feedback.userId,
        email: schema.users.email,
        content: schema.feedback.content,
        status: schema.feedback.status,
        createdAt: schema.feedback.createdAt,
      })
      .from(schema.feedback)
      .leftJoin(schema.users, eq(schema.feedback.userId, schema.users.id))
      .orderBy(desc(schema.feedback.createdAt))
      .all()
  }

  /** 更新反馈处理状态 —— 管理员 */
  async updateStatus(id: string, status: FeedbackStatus) {
    const result = await db
      .update(schema.feedback)
      .set({ status })
      .where(eq(schema.feedback.id, id))
      .run()
    if (result.rowsAffected === 0) {
      throw new NotFoundException(`feedback "${id}" not found`)
    }
    return { id, status }
  }
}
