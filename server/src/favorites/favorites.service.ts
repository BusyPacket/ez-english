import { Injectable, NotFoundException } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { and, desc, eq } from 'drizzle-orm'
import { db, schema } from '../database/database'
import type { CreateFavoriteDto } from './favorites.schema'

@Injectable()
export class FavoritesService {
  /** 收藏一道题（题目内容快照落库） */
  async create(userId: string, dto: CreateFavoriteDto) {
    const row = {
      id: randomUUID(),
      userId,
      pointId: dto.pointId,
      pointTitle: dto.pointTitle ?? null,
      type: dto.type,
      stem: dto.stem,
      choices: dto.choices?.length ? JSON.stringify(dto.choices) : null,
      answer: dto.answer,
      analysis: dto.analysis ?? null,
      createdAt: new Date().toISOString(),
    }
    await db.insert(schema.favorites).values(row).run()
    return { ...row, choices: dto.choices }
  }

  /** 当前用户收藏列表（按时间倒序） */
  async listByUser(userId: string) {
    const rows = await db
      .select()
      .from(schema.favorites)
      .where(eq(schema.favorites.userId, userId))
      .orderBy(desc(schema.favorites.createdAt))
      .all()
    return rows.map((r) => ({
      id: r.id,
      pointId: r.pointId,
      pointTitle: r.pointTitle,
      type: r.type,
      stem: r.stem,
      choices: r.choices ? (JSON.parse(r.choices) as string[]) : null,
      answer: r.answer,
      analysis: r.analysis,
      createdAt: r.createdAt,
    }))
  }

  /** 取消收藏（仅限本人收藏） */
  async remove(userId: string, id: string) {
    const result = await db
      .delete(schema.favorites)
      .where(and(eq(schema.favorites.id, id), eq(schema.favorites.userId, userId)))
      .run()
    if (result.rowsAffected === 0) {
      throw new NotFoundException('收藏不存在')
    }
    return { id }
  }
}
