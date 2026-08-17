// 创建 root 管理员账号（幂等：已存在则更新密码与角色）
// 运行：在 server 目录执行 `node scripts/create-root.js`
const { createClient } = require('@libsql/client')
const { randomBytes, randomUUID, scryptSync } = require('node:crypto')
const { join } = require('node:path')

const client = createClient({
  url: `file:${join(process.cwd(), 'data', 'ez-english.db').replace(/\\/g, '/')}`,
})

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64)
  return `${salt}:${hash.toString('hex')}`
}

const email = 'root@test.com'
const password = 'root'
const passwordHash = hashPassword(password)
const createdAt = new Date().toISOString()

client
  .execute({
    sql: `INSERT INTO users (id, email, nickname, password_hash, role, created_at)
          VALUES (?, ?, ?, ?, ?, ?)
          ON CONFLICT(email) DO UPDATE SET
            password_hash = excluded.password_hash,
            role = 'admin'`,
    args: [randomUUID(), email, null, passwordHash, 'admin', createdAt],
  })
  .then(() => {
    console.log('✅ admin user created:', email)
    process.exit(0)
  })
  .catch((e) => {
    console.error('❌', e.message)
    process.exit(1)
  })
