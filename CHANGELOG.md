# Changelog

本项目的所有重要变更都会记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本号遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### 2026-08-22

#### Added

- 写作学习页：共享考点大纲新增「写作」section（5 个叶子考点），`totalPointCount` 63 → 68
  - 前 4 个专项考点：知识讲解 + 示例（学习模式，静态数据 `writingLessons.ts`）
  - `writing-essay` 完整作文：AI 作文题 + 写作文 + AI 点评（`generate-writing` / `review-writing` 接口）
- 普通用户 7 天免费试用期
  - 管理员后台可视化配置试用天数（`/settings/trial-days`）
  - 到期后不再拦截页面，仅禁用 AI 能力（三个 AI 接口 `assertTrialAvailable`），会员/管理员豁免
  - 个人中心展示剩余试用期

### 2026-08-21

#### Added

- 会员单向升级：普通用户 → 会员（`PATCH /users/:id/promote`），管理员后台「升级会员」按钮
- 例题功能：例题题库表 `questions`（63 个考点各 1 道单选题 + 种子脚本），后台新增/编辑/删除/分页搜索管理

#### Changed

- 首页界面焕新（更炫酷的首页）
- 接入本地 CI 脚本（`scripts/ci.mjs`：依赖校验 → Prettier → 类型检查 → lint → build）

#### Fixed

- 修复若干问题

### 2026-08-19

#### Added

- 收藏夹功能：`favorites` 表存题目内容快照，收藏/取消收藏/收藏夹页（`/favorites`）
- 例题库答题：练习页顶部例题库折叠面板，按考点拉取例题、上一题/下一题、复用 `QuestionCard` 答题
- 答题数统计：`users.answer_count` 字段，判分后静默上报 `/profile/answer`
- 后台例题管理：管理员页面添加/编辑例题（三种题型 single / fill / judge）
- 后台用户管理页面重构（管理页重构、适配移动端）

#### Changed

- 考点大纲补充（docs）
- 导航栏支持移动端

### 2026-08-18

#### Added

- 考点练习功能：`QuestionCard` 通用答题组件 + 练习页重构（例题库 / AI 生成 / 追问）
- AI 生成功能：`/api/ai/generate-question`（按考点 + 题型生成）、回到顶部按钮 `BackToTop`
- AI 配置功能：个人中心配置 DeepSeek API Key / 模型（`profiles` 表）
- 追问功能：`/api/ai/follow-up` 多轮对话，回复用 Markdown 渲染
- 注册开放开关：管理员后台控制系统设置（`/settings/registration-open`）
- 登录追踪：记录上次登录 IP / 地区 / 活跃时间
- 低余额拦截：AI 生成前检查 DeepSeek 余额（低于 0.5 元阻止生成）
- 导航栏计时器
- 侧边目录模式 + 字体大小调节

#### Changed

- 优化 AI 生成功能（多题型支持、考纲词汇约束、JSON 兜底校验）
- 考点大纲补充（二级考点树状化）

### 2026-08-17

#### Added

- 初始化 monorepo 项目（Vue 3 前端 + NestJS 后端 + SQLite，pnpm workspace）
- 登录和注册功能（邮箱 + 密码，scrypt 哈希，JWT）
- 管理员用户后台页面
- 反馈功能
- 考点大纲和解析（静态数据）
- 学习进度后端联动（`/api/progress` CRUD，含 Pinia store 同步）
- 排行榜（按答题/进度统计）
- 24 年真题
- 修改昵称和修改密码功能
- 试卷目录功能
- 试卷存储从前端迁移到后端（`exam-papers` 数据源）

#### Fixed

- 修复问卷相关报错
