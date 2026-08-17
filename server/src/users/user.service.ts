import { ConflictException, Injectable } from '@nestjs/common'
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { db, schema } from '../database/database'
import { UserRole, type RegisterDto } from './user.schema'

@Injectable()
export class UserService {
  async findByEmail(email: string) {
    return db.select().from(schema.users).where(eq(schema.users.email, email)).get()
  }

  async create(dto: RegisterDto) {
    const existing = await this.findByEmail(dto.email)
    if (existing) {
      throw new ConflictException('该邮箱已注册')
    }

    const passwordHash = this.hashPassword(dto.password)
    // 注册时间：带时区的 UTC 时间（ISO 8601，如 2026-08-17T09:14:15.084Z）
    const createdAt = new Date().toISOString()

    const inserted = await db
      .insert(schema.users)
      .values({
        id: randomUUID(),
        email: dto.email,
        nickname: null,
        passwordHash,
        role: UserRole.User,
        createdAt,
      })
      .returning()
      .get()

    return {
      id: inserted.id,
      email: inserted.email,
      nickname: inserted.nickname,
      role: inserted.role,
      createdAt: inserted.createdAt,
    }
  }

  verifyPassword(password: string, passwordHash: string): boolean {
    const [salt, storedHash] = passwordHash.split(':')
    if (!salt || !storedHash) return false
    const hash = scryptSync(password, salt, 64)
    return timingSafeEqual(hash, Buffer.from(storedHash, 'hex'))
  }

  private hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex')
    const hash = scryptSync(password, salt, 64)
    return `${salt}:${hash.toString('hex')}`
  }
}
