# ez-english

让学习英语变得简单 —— 浙江专升本英语学习工具。

前后端分离的 **monorepo** 项目：Vue 3 前端 + NestJS 后端 + SQLite。

## 亮点

- 学了才花钱（消耗Token），不学就不花钱，不浪费一分钱
- TS全栈，部署方便，使用sqlite，数据库也不用装

## 技术栈

| 端             | 技术                                                                  |
| -------------- | --------------------------------------------------------------------- |
| 前端 `client/` | Vue 3 · TypeScript · Vite · Pinia · Vue Router · Naive UI（自动导入） |
| 后端 `server/` | NestJS · node:sqlite · Drizzle ORM · Zod（DTO 校验）· REST API        |
| 工程化         | pnpm workspace（monorepo）                                            |

## 目录结构

```
ez-english/
├── client/                  # 前端（Vue 3 SPA）
│   ├── src/
│   │   ├── components/      # 通用组件（导航栏等）
│   │   ├── data/            # 静态数据（考点大纲、真题等）
│   │   ├── router/          # 路由
│   │   ├── stores/          # Pinia store（主题、进度）
│   │   ├── types/           # 共享类型定义
│   │   └── views/           # 页面（首页、进度、考试大纲、真题）
│   └── package.json
├── server/                  # 后端（NestJS + SQLite）
│   ├── src/
│   │   ├── common/          # 通用（Zod 校验管道等）
│   │   ├── database/        # Drizzle schema 与数据库连接
│   │   ├── progress/        # 学习进度模块（示例 CRUD）
│   │   ├── app.module.ts
│   │   └── main.ts          # 入口（端口 3000，前缀 /api）
│   └── package.json
├── exam-papers/             # 历年真题源文件（PDF/Markdown）
├── pnpm-workspace.yaml
└── package.json             # workspace 根（统一脚本）
```

## 快速开始

要求：Node.js ≥ 22、pnpm ≥ 9

```bash
# 1. 安装全部 workspace 依赖（client + server）
pnpm install

# 2. 同时启动前后端
pnpm dev
# 或分别启动：
#   pnpm dev:client   → 前端 http://localhost:5173
#   pnpm dev:server   → 后端 http://localhost:3000/api

# 3. 构建 / 类型检查
pnpm build          # 构建所有包
pnpm type-check     # 前端 vue-tsc 类型检查

# 4. 本地 CI 检查（依赖校验 → Prettier → 类型 → lint → 构建）
pnpm check          # 完整检查（含 pnpm install --frozen-lockfile）
pnpm check:quick    # 跳过依赖校验，快速检查
```

> 本地 CI 脚本位于 `scripts/ci.mjs`，按顺序执行：`pnpm install --frozen-lockfile` → `format:check` → 全子包 `type-check` → `lint` → `build`，任一步失败即终止并返回非零退出码。

## 后端 API

启动后，REST 接口统一挂在 `/api` 前缀下：

| 方法   | 路径                 | 说明                                                       |
| ------ | -------------------- | ---------------------------------------------------------- |
| GET    | `/api/health`        | 健康检查                                                   |
| POST   | `/api/auth/register` | 注册（body: `{ "email", "password" }`，Zod 校验）          |
| GET    | `/api/progress`      | 获取全部学习进度                                           |
| GET    | `/api/progress/:id`  | 获取单个考点进度                                           |
| PUT    | `/api/progress/:id`  | 更新/创建进度（body: `{ "status": "learned" }`，Zod 校验） |
| DELETE | `/api/progress/:id`  | 删除进度                                                   |

SQLite 数据库文件位于 `server/data/ez-english.db`（首次启动自动创建，已 gitignore）。

## 用户表需求

| 需求     | 说明                                                                       |
| -------- | -------------------------------------------------------------------------- |
| 用户名   | 即邮箱（`email`），唯一                                                    |
| 密码     | 至少 6 位（存储为 scrypt 哈希）                                            |
| 主键     | `id`，UUID（应用生成，`node:crypto` 的 `randomUUID`）                      |
| 昵称     | `nickname`，备用字段，可空                                                 |
| 角色     | StrEnum：`user` 普通用户 / `member` 会员用户（保留）/ `admin` 管理员       |
| 注册时间 | `created_at`，带时区的 UTC 时间（ISO 8601，如 `2026-08-17T09:14:15.084Z`） |

## 数据流

```
client/ (Vue SPA)
   │  HTTP /api/*
   ▼
server/ (NestJS)
   │  Drizzle ORM (node:sqlite)
   ▼
server/data/ez-english.db (SQLite)
```

前端静态数据（考点大纲、真题）暂保留在 `client/src/data/`；学习进度等需要持久化的数据可逐步迁移到后端 API。

## CI 与自动部署（GitHub Actions）

两个职责独立的 workflow：

- **`ci.yml`（CI · 质量检查）**：push 到 `main` 或 PR 时运行 `scripts/ci.mjs`（依赖校验 → Prettier → 3 包类型检查 → lint → build），任一步失败即失败
- **`deploy.yml`（CD · 自动部署）**：**PR 合并到 `main`** 后自动执行（也可在 Actions 页手动触发）。构建在 GitHub runner 上完成，直接 rsync 产物到服务器并重启服务——**服务器无需代码仓库 / pnpm / 部署脚本**

### 配置自动部署（一次即可）

**1. 服务器端**：生成 SSH 密钥对，把公钥加入登录用户的 `~/.ssh/authorized_keys`

```bash
ssh-keygen -t ed25519 -f ~/.ssh/deploy_key -N "" -C "github-deploy"
cat ~/.ssh/deploy_key.pub >> ~/.ssh/authorized_keys
```

**2. GitHub 端**：仓库 → Settings → Secrets and variables → Actions → New repository secret，添加：

| Secret 名        | 值                                                                           |
| ---------------- | ---------------------------------------------------------------------------- |
| `SERVER_SSH_KEY` | 服务器上的私钥内容（`deploy_key`，含 `-----BEGIN OPENSSH PRIVATE KEY-----`） |
| `SERVER_HOST`    | 服务器 IP 或域名                                                             |
| `SERVER_USER`    | 登录用户（如 `root` 或部署专用用户）                                         |
| `SERVER_PORT`    | SSH 端口（默认 `22`）                                                        |

> ⚠️ 部署使用 `sudo rsync` / `sudo systemctl`，登录用户需**免密 sudo** 权限。

## 部署（Linux VPS：Nginx + systemd）

前后端分离部署，无需 Docker、无需安装数据库。构建全部由 GitHub Actions 完成，**服务器只需运行环境**：

| 位置                          | 用途                                                |
| ----------------------------- | --------------------------------------------------- |
| `/var/www/ez-english/dist`    | 前端静态文件（Nginx root，`client` 构建产物）       |
| `/opt/ez-english/server`      | 后端运行目录（`server` 构建产物，systemd 工作目录） |
| `/opt/ez-english/server/data` | SQLite 数据库（持久化，部署时受保护不清空）         |

### 服务器一次性初始化

```bash
# 1. 安装环境（只需运行 Node、nginx、rsync；无需 pnpm / 代码仓库）
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt install -y nodejs
sudo apt install -y nginx rsync

# 2. 安装 systemd 服务（deploy/ez-english.service）
sudo cp deploy/ez-english.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now ez-english

# 3. 安装 Nginx 站点（deploy/nginx.conf）
sudo cp deploy/nginx.conf /etc/nginx/sites-available/ez-english
sudo ln -s /etc/nginx/sites-available/ez-english /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

> `deploy/ez-english.service` 与 `deploy/nginx.conf` 按需修改（目录、端口、域名）。部署相关文件均位于 `deploy/`。

### 部署流程（全自动）

PR 合并到 `main` → GitHub Actions 自动完成：

1. 在 runner 上构建 `shared → client → server`
2. `pnpm --filter server deploy --prod` 生成后端部署产物（含生产依赖）
3. rsync 前端到 `/var/www/ez-english/dist`
4. rsync 后端到 `/opt/ez-english/server`（`--exclude data` 保护数据库）
5. SSH 重启 systemd 服务 + 重载 Nginx

无需在服务器上拉代码、装 pnpm 或执行任何脚本；也可在 Actions 页手动触发部署。
