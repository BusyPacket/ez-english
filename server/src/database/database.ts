import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import * as schema from './schema'

const dataDir = process.env.DB_DIR ?? join(process.cwd(), 'data')
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true })
}

const dbFile = join(dataDir, 'ez-english.db').replace(/\\/g, '/')
const client = createClient({ url: `file:${dbFile}` })

export const db = drizzle(client, { schema })

export { schema }
