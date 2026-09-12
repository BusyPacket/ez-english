import { Injectable } from '@nestjs/common'
import { asc, eq, inArray } from 'drizzle-orm'
import { createHash, randomUUID } from 'node:crypto'
import { db, schema } from '../database/database'
import { SettingsService } from '../settings/settings.service'
import type { GeneratedQuestion } from './ai.schema'

export const PRACTICE_CACHE_VERSION = 'practice-v1'
@Injectable()
export class AiGenerationCacheService {
  constructor(private readonly settingsService: SettingsService) {}

  buildPracticeKey(model: string, point: string, type: string): string {
    return `practice:${PRACTICE_CACHE_VERSION}:${model}:${point}:${type}`
  }

  async findPracticeQuestions(cacheKey: string): Promise<GeneratedQuestion[]> {
    const maxCacheSize = await this.settingsService.getAiCacheLimit()
    if (maxCacheSize === 0) return []
    await this.trimCache(cacheKey, maxCacheSize)
    const rows = await db
      .select()
      .from(schema.aiQuestionCache)
      .where(eq(schema.aiQuestionCache.cacheKey, cacheKey))
      .orderBy(asc(schema.aiQuestionCache.createdAt))
      .all()

    const questions: GeneratedQuestion[] = []
    for (const row of rows) {
      try {
        questions.push(JSON.parse(row.payload) as GeneratedQuestion)
      } catch {
        await db.delete(schema.aiQuestionCache).where(eq(schema.aiQuestionCache.id, row.id)).run()
      }
    }
    return questions
  }

  async addPracticeQuestion(cacheKey: string, question: GeneratedQuestion): Promise<void> {
    const maxCacheSize = await this.settingsService.getAiCacheLimit()
    if (maxCacheSize === 0) return
    const stemHash = createHash('sha256').update(this.normalizeStem(question.stem)).digest('hex')
    const now = new Date().toISOString()

    await db
      .insert(schema.aiQuestionCache)
      .values({
        id: randomUUID(),
        cacheKey,
        stemHash,
        payload: JSON.stringify(question),
        createdAt: now,
      })
      .onConflictDoNothing({
        target: [schema.aiQuestionCache.cacheKey, schema.aiQuestionCache.stemHash],
      })
      .run()

    await this.trimCache(cacheKey, maxCacheSize)
  }

  private async trimCache(cacheKey: string, maxCacheSize: number): Promise<void> {
    const rows = await db
      .select({ id: schema.aiQuestionCache.id, createdAt: schema.aiQuestionCache.createdAt })
      .from(schema.aiQuestionCache)
      .where(eq(schema.aiQuestionCache.cacheKey, cacheKey))
      .orderBy(asc(schema.aiQuestionCache.createdAt))
      .all()

    if (rows.length > maxCacheSize) {
      const expiredIds = rows.slice(0, rows.length - maxCacheSize).map((row) => row.id)
      await db
        .delete(schema.aiQuestionCache)
        .where(inArray(schema.aiQuestionCache.id, expiredIds))
        .run()
    }
  }

  private normalizeStem(stem: string): string {
    return stem.toLowerCase().replace(/[\s\u3000]+/g, '')
  }
}
