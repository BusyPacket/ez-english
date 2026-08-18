import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto'
import { count, eq, like, or } from 'drizzle-orm'
import { db, schema } from '../database/database'
import { SettingsService } from '../settings/settings.service'
import { UserRole, type RegisterDto } from './user.schema'

@Injectable()
export class UserService {
  constructor(private readonly settingsService: SettingsService) {}
  async findByEmail(email: string) {
    return db.select().from(schema.users).where(eq(schema.users.email, email)).get()
  }

  /** 分页查询用户列表（不含密码），支持按邮箱/昵称模糊搜索 */
  async listUsers(page = 1, pageSize = 10, keyword = '') {
    const where = keyword
      ? or(like(schema.users.email, `%${keyword}%`), like(schema.users.nickname, `%${keyword}%`))
      : undefined
    const offset = (page - 1) * pageSize
    const items = await db
      .select({
        id: schema.users.id,
        email: schema.users.email,
        nickname: schema.users.nickname,
        role: schema.users.role,
        createdAt: schema.users.createdAt,
      })
      .from(schema.users)
      .where(where)
      .orderBy(schema.users.createdAt)
      .limit(pageSize)
      .offset(offset)
      .all()
    const [{ value: total }] = await db.select({ value: count() }).from(schema.users).where(where)
    return { items, total: Number(total), page, pageSize }
  }

  async remove(id: string) {
    const result = await db.delete(schema.users).where(eq(schema.users.id, id)).run()
    if (result.rowsAffected === 0) {
      throw new NotFoundException('用户不存在')
    }
  }

  /** 修改当前用户昵称，返回更新后的用户信息（不含密码） */
  async updateNickname(id: string, nickname: string) {
    const updated = await db
      .update(schema.users)
      .set({ nickname })
      .where(eq(schema.users.id, id))
      .returning({
        id: schema.users.id,
        email: schema.users.email,
        nickname: schema.users.nickname,
        role: schema.users.role,
        createdAt: schema.users.createdAt,
      })
      .get()
    if (!updated) {
      throw new NotFoundException('用户不存在')
    }
    return updated
  }

  /** 修改密码：校验当前密码正确后更新为 scrypt 新哈希 */
  async updatePassword(id: string, currentPassword: string, newPassword: string) {
    const user = await db.select().from(schema.users).where(eq(schema.users.id, id)).get()
    if (!user) {
      throw new NotFoundException('用户不存在')
    }
    if (!this.verifyPassword(currentPassword, user.passwordHash)) {
      throw new BadRequestException('当前密码不正确')
    }
    await db
      .update(schema.users)
      .set({ passwordHash: this.hashPassword(newPassword) })
      .where(eq(schema.users.id, id))
      .run()
    return { message: '密码修改成功' }
  }

  async create(dto: RegisterDto) {
    // 注册开关校验：未开放则拒绝（后端兜底，防止绕过前端）
    const { open } = await this.settingsService.getRegistrationOpen()
    if (!open) {
      throw new BadRequestException('注册暂未开放')
    }

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
