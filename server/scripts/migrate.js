// 手动应用 drizzle 迁移（等价于后端启动时 main.ts 里的 migrate 调用）
// 运行：在 server 目录执行 `node scripts/migrate.js`
const { createClient } = require('@libsql/client')
const { drizzle } = require('drizzle-orm/libsql')
const { migrate } = require('drizzle-orm/libsql/migrator')
const { join } = require('node:path')

const client = createClient({
  url: `file:${join(process.cwd(), 'data', 'ez-english.db').replace(/\\/g, '/')}`,
})
const db = drizzle(client)

migrate(db, { migrationsFolder: join(process.cwd(), 'drizzle') })
  .then(() => {
    console.log('✅ 迁移已应用')
    process.exit(0)
  })
  .catch((e) => {
    console.error('❌', e.message)
    process.exit(1)
  })
