import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto'
import { and, count, eq, like, or, sql } from 'drizzle-orm'
import { db, schema } from '../database/database'
import { SettingsService } from '../settings/settings.service'
import { UserRole, userRoleValues, type RegisterDto } from './user.schema'

@Injectable()
export class UserService {
  constructor(private readonly settingsService: SettingsService) {}
  async findByEmail(email: string) {
    return db.select().from(schema.users).where(eq(schema.users.email, email)).get()
  }

  /** 分页查询用户列表（不含密码），支持按邮箱/昵称模糊搜索、按角色筛选 */
  async listUsers(page = 1, pageSize = 10, keyword = '', role = '') {
    const conditions = []
    if (keyword) {
      const keywordCond = or(
        like(schema.users.email, `%${keyword}%`),
        like(schema.users.nickname, `%${keyword}%`),
      )
      if (keywordCond) conditions.push(keywordCond)
    }
    if (role && userRoleValues.includes(role as UserRole)) {
      conditions.push(eq(schema.users.role, role))
    }
    const where = conditions.length ? and(...conditions) : undefined
    const offset = (page - 1) * pageSize
    const items = await db
      .select({
        id: schema.users.id,
        email: schema.users.email,
        nickname: schema.users.nickname,
        role: schema.users.role,
        createdAt: schema.users.createdAt,
        lastActiveAt: schema.users.lastActiveAt,
        lastLoginIp: schema.users.lastLoginIp,
        lastLoginRegion: schema.users.lastLoginRegion,
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

  /** 单向升级：普通用户 → 会员。幂等：已是会员直接返回；管理员不允许被降级为会员 */
  async promoteToMember(id: string) {
    const user = await db.select().from(schema.users).where(eq(schema.users.id, id)).get()
    if (!user) {
      throw new NotFoundException('用户不存在')
    }
    if (user.role === UserRole.Admin) {
      throw new BadRequestException('管理员账号无需升级为会员')
    }
    if (user.role === UserRole.Member) {
      return { id, role: UserRole.Member }
    }
    await db
      .update(schema.users)
      .set({ role: UserRole.Member })
      .where(eq(schema.users.id, id))
      .run()
    return { id, role: UserRole.Member }
  }

  /** 普通用户试用期是否已到期（会员/管理员豁免） */
  async isTrialExpired(userId: string): Promise<boolean> {
    const user = await db
      .select({
        role: schema.users.role,
        createdAt: schema.users.createdAt,
      })
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .get()
    if (!user) return false
    if (user.role === UserRole.Member || user.role === UserRole.Admin) return false
    const trialDays = await this.settingsService.getTrialDays()
    const trialEnd = new Date(user.createdAt).getTime() + trialDays * 24 * 60 * 60 * 1000
    return Date.now() > trialEnd
  }

  /** 答题数 +1（每次提交一道题目），返回最新答题数 */
  async incrementAnswerCount(id: string) {
    const updated = await db
      .update(schema.users)
      .set({ answerCount: sql`${schema.users.answerCount} + 1` })
      .where(eq(schema.users.id, id))
      .returning({ answerCount: schema.users.answerCount })
      .get()
    if (!updated) {
      throw new NotFoundException('用户不存在')
    }
    return updated.answerCount
  }

  /** 获取当前用户资料（不含密码，含答题数与免费试用期信息） */
  async getProfile(id: string) {
    const user = await db
      .select({
        id: schema.users.id,
        email: schema.users.email,
        nickname: schema.users.nickname,
        role: schema.users.role,
        createdAt: schema.users.createdAt,
        answerCount: schema.users.answerCount,
      })
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .get()
    if (!user) {
      throw new NotFoundException('用户不存在')
    }
    // 免费试用期：普通用户从注册时间起试用 trialDays 天；会员/管理员不受限制
    const trialDays = await this.settingsService.getTrialDays()
    const exempt = user.role === UserRole.Member || user.role === UserRole.Admin
    const remaining =
      new Date(user.createdAt).getTime() + trialDays * 24 * 60 * 60 * 1000 - Date.now()
    return {
      ...user,
      trialDays,
      trialExpired: !exempt && remaining <= 0,
      trialRemainingMs: exempt ? null : Math.max(0, remaining),
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

  /** 记录登录信息（IP、地区、活跃时间） */
  async recordLogin(id: string, ip: string, region: string | null, lastActiveAt: string) {
    await db
      .update(schema.users)
      .set({ lastLoginIp: ip, lastLoginRegion: region, lastActiveAt })
      .where(eq(schema.users.id, id))
      .run()
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
