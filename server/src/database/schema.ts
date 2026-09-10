import { integer, primaryKey, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

// 用户表（Drizzle schema，单一权威定义）
export const users = sqliteTable('users', {
  // 主键：UUID（由应用生成，node:crypto randomUUID）
  id: text('id').primaryKey(),
  // 用户名即邮箱
  email: text('email').notNull().unique(),
  // 昵称（唯一且区分大小写；SQLite 的 UNIQUE 允许多个 NULL，兼容历史无昵称用户）
  nickname: text('nickname').unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('user'),
  // 注册时间：带时区的 UTC 时间（ISO 8601）
  createdAt: text('created_at').notNull(),
  // 最近活跃时间（登录时更新）：带时区的 UTC 时间（ISO 8601）
  lastActiveAt: text('last_active_at'),
  // 最近登录 IP
  lastLoginIp: text('last_login_ip'),
  // 最近登录 IP 所在地区（国家/省/市）
  lastLoginRegion: text('last_login_region'),
  // 答题数（每次提交一道题目 +1）
  answerCount: integer('answer_count').notNull().default(0),
})

// 学习进度表（按用户维度：user_id + point_id 联合主键）
export const progress = sqliteTable(
  'progress',
  {
    userId: text('user_id').notNull(),
    pointId: text('point_id').notNull(),
    // 学习状态：todo / learning / learned / mastered（对应共享包 KnowledgeStatus 枚举值）
    status: text('status').notNull().default('todo'),
    // 最近更新时间：带时区的 UTC 时间（ISO 8601）
    updatedAt: text('updated_at').notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.pointId] })],
)

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

// 用户 AI 配置表（每个用户一条，按 userId 主键）
export const profiles = sqliteTable('profiles', {
  // 关联 users.id
  userId: text('user_id').primaryKey(),
  // AI 公司：deepseek（目前仅支持）
  aiProvider: text('ai_provider').notNull().default('deepseek'),
  // AI 模型（如 deepseek-v4-flash / deepseek-v4-pro）
  model: text('ai_model').notNull().default('deepseek-v4-flash'),
  // API Key（格式校验：sk- 开头）
  apiKey: text('api_key').notNull(),
  // 更新时间：带时区的 UTC 时间（ISO 8601）
  updatedAt: text('updated_at').notNull(),
})

// 系统配置表（key-value，如注册开关等，支持运行时动态修改）
export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: text('updated_at').notNull(),
})

// 收藏夹表（用户收藏的 AI 生成题目快照）
export const favorites = sqliteTable('favorites', {
  id: text('id').primaryKey(),
  // 收藏者用户 id（关联 users.id）
  userId: text('user_id').notNull(),
  // 所属考点 id（来自 /practice?point=）
  pointId: text('point_id').notNull(),
  // 考点中文标题
  pointTitle: text('point_title'),
  // 题型：single / fill / judge
  type: text('type').notNull(),
  // 题干
  stem: text('stem').notNull(),
  // 选项（JSON 数组字符串，仅选择题）
  choices: text('choices'),
  // 答案
  answer: text('answer').notNull(),
  // 解析
  analysis: text('analysis'),
  // 收藏时间：带时区的 UTC 时间（ISO 8601）
  createdAt: text('created_at').notNull(),
})

// 例题表（内置单选题，覆盖各考点，供练习与抽题使用）
export const questions = sqliteTable('questions', {
  id: text('id').primaryKey(),
  // 题目类型：single（单选题，当前唯一）
  type: text('type').notNull().default('single'),
  // 考点 id（来自共享大纲 allPointIds）
  pointId: text('point_id').notNull(),
  // 考点中文标题
  pointTitle: text('point_title'),
  // 题干
  stem: text('stem').notNull(),
  // 选项（JSON 数组字符串，单选题 4 个选项）
  choices: text('choices').notNull(),
  // 正确答案（选项标识，如 A）
  answer: text('answer').notNull(),
  // 解析
  analysis: text('analysis'),
  // 创建时间：带时区的 UTC 时间（ISO 8601）
  createdAt: text('created_at').notNull(),
})

// 答题记录表（每用户每题一条：记录用户选择的答案/选项 + 判分，供例题库已答标记与排序）
export const questionAnswers = sqliteTable(
  'question_answers',
  {
    // 主键：UUID（由应用生成，node:crypto randomUUID）
    id: text('id').primaryKey(),
    // 答题用户 id（关联 users.id）
    userId: text('user_id').notNull(),
    // 题目 id（关联 questions.id）
    questionId: text('question_id').notNull(),
    // 题型：single 单选 / fill 填空 / judge 判断
    type: text('type').notNull().default('single'),
    // 用户选择的答案：单选为选项字母（如 A），判断为「正确/错误」，填空为用户输入文本
    userAnswer: text('user_answer').notNull(),
    // 是否正确：0 否 / 1 是
    isCorrect: integer('is_correct').notNull().default(0),
    // 答题时间：带时区的 UTC 时间（ISO 8601）
    answeredAt: text('answered_at').notNull(),
  },
  // 同一用户对同一道题只保留一条记录（重复作答时更新，避免历史堆积）
  (table) => [uniqueIndex('question_answers_user_question_uk').on(table.userId, table.questionId)],
)

// 错题表（每用户每题一条：例题库作答错误时自动记录，仅本人可见）
export const wrongQuestions = sqliteTable(
  'wrong_questions',
  {
    // 主键：UUID（由应用生成，node:crypto randomUUID）
    id: text('id').primaryKey(),
    // 用户 id（关联 users.id）
    userId: text('user_id').notNull(),
    // 题目 id（关联 questions.id）
    questionId: text('question_id').notNull(),
    // 最近一次答错的答案（单选为字母，判断为「正确/错误」，填空为输入文本）
    lastWrongAnswer: text('last_wrong_answer').notNull(),
    // 累计答错次数
    wrongCount: integer('wrong_count').notNull().default(1),
    // 首次做错（加入错题本）时间：带时区的 UTC 时间（ISO 8601）
    createdAt: text('created_at').notNull(),
    // 最近一次做错时间：带时区的 UTC 时间（ISO 8601）
    updatedAt: text('updated_at').notNull(),
  },
  // 同一用户同一道题只保留一条（重复做错累加次数）
  (table) => [uniqueIndex('wrong_questions_user_question_uk').on(table.userId, table.questionId)],
)

// 每日答题统计表（用户 × 日期 联合主键）
// 仅当用户在某天有答题时插入一行；没有答题的日期不落库，节省存储空间。
// 日期语义：北京时间（UTC+8）的 YYYY-MM-DD。
export const userDailyAnswers = sqliteTable(
  'user_daily_answers',
  {
    // 答题用户 id（关联 users.id）
    userId: text('user_id').notNull(),
    // 日期：北京时间(UTC+8)的 YYYY-MM-DD
    date: text('date').notNull(),
    // 当日答题数（每次提交一题 +1）
    count: integer('count').notNull().default(1),
  },
  (table) => [primaryKey({ columns: [table.userId, table.date] })],
)

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Progress = typeof progress.$inferSelect
export type NewProgress = typeof progress.$inferInsert
export type Feedback = typeof feedback.$inferSelect
export type NewFeedback = typeof feedback.$inferInsert
export type Profile = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert
export type Setting = typeof settings.$inferSelect
export type NewSetting = typeof settings.$inferInsert
export type Favorite = typeof favorites.$inferSelect
export type NewFavorite = typeof favorites.$inferInsert
export type Question = typeof questions.$inferSelect
export type NewQuestion = typeof questions.$inferInsert
export type QuestionAnswer = typeof questionAnswers.$inferSelect
export type NewQuestionAnswer = typeof questionAnswers.$inferInsert
export type UserDailyAnswer = typeof userDailyAnswers.$inferSelect
export type NewUserDailyAnswer = typeof userDailyAnswers.$inferInsert
