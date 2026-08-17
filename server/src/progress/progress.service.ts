import { Injectable, NotFoundException } from '@nestjs/common'
import db from '../database/database'
import type { UpdateProgressDto } from './progress.schema'

export interface ProgressRecord {
  id: string
  status: string
}

@Injectable()
export class ProgressService {
  getAll(): ProgressRecord[] {
    const rows = db.prepare('SELECT id, status FROM progress ORDER BY id').all()
    return rows as unknown as ProgressRecord[]
  }

  getOne(id: string): ProgressRecord {
    const row = db.prepare('SELECT id, status FROM progress WHERE id = ?').get(id) as unknown as
      ProgressRecord | undefined
    if (!row) {
      throw new NotFoundException(`progress "${id}" not found`)
    }
    return row
  }

  upsert(id: string, dto: UpdateProgressDto): ProgressRecord {
    db.prepare(
      `INSERT INTO progress (id, status) VALUES (?, ?)
       ON CONFLICT(id) DO UPDATE SET status = excluded.status`,
    ).run(id, dto.status)
    return this.getOne(id)
  }

  remove(id: string): void {
    const result = db.prepare('DELETE FROM progress WHERE id = ?').run(id)
    if (result.changes === 0) {
      throw new NotFoundException(`progress "${id}" not found`)
    }
  }
}
