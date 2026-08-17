import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

// 用户表（Drizzle schema，单一权威定义）
export const users = sqliteTable('users', {
  // 主键：UUID（由应用生成，node:crypto randomUUID）
  id: text('id').primaryKey(),
  // 用户名即邮箱
  email: text('email').notNull().unique(),
  // 昵称（备用字段）
  nickname: text('nickname'),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('user'),
  // 注册时间：带时区的 UTC 时间（ISO 8601）
  createdAt: text('created_at').notNull(),
})

// 学习进度表
export const progress = sqliteTable('progress', {
  id: text('id').primaryKey(),
  status: text('status').notNull().default('todo'),
})

// 用户反馈表
export const feedback = sqliteTable('feedback', {
  id: text('id').primaryKey(),
  // 提交反馈的用户 id（关联 users.id）
  userId: text('user_id').notNull(),
  // 反馈内容
  content: text('content').notNull(),
  // 处理状态：pending（未处理）/ resolved（已解决）
  status: text('status').notNull().default('pending'),
  // 提交时间：带时区的 UTC 时间（ISO 8601）
  createdAt: text('created_at').notNull(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Progress = typeof progress.$inferSelect
export type NewProgress = typeof progress.$inferInsert
export type Feedback = typeof feedback.$inferSelect
export type NewFeedback = typeof feedback.$inferInsert
