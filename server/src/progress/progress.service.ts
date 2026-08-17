import { Injectable, NotFoundException } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { db, schema } from '../database/database'
import type { UpdateProgressDto } from './progress.schema'

@Injectable()
export class ProgressService {
  async getAll() {
    return db.select().from(schema.progress).orderBy(schema.progress.id).all()
  }

  async getOne(id: string) {
    const row = await db.select().from(schema.progress).where(eq(schema.progress.id, id)).get()
    if (!row) {
      throw new NotFoundException(`progress "${id}" not found`)
    }
    return row
  }

  async upsert(id: string, dto: UpdateProgressDto) {
    await db
      .insert(schema.progress)
      .values({ id, status: dto.status })
      .onConflictDoUpdate({ target: schema.progress.id, set: { status: dto.status } })
      .run()
    return this.getOne(id)
  }

  async remove(id: string): Promise<void> {
    const result = await db.delete(schema.progress).where(eq(schema.progress.id, id)).run()
    if (result.rowsAffected === 0) {
      throw new NotFoundException(`progress "${id}" not found`)
    }
  }
}
