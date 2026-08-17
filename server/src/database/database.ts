import { DatabaseSync } from 'node:sqlite'
import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const dataDir = process.env.DB_DIR ?? join(process.cwd(), 'data')
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true })
}

const db = new DatabaseSync(join(dataDir, 'ez-english.db'))
db.exec('PRAGMA journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS progress (
    id TEXT PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'todo'
  );
`)

export default db
