import { z } from 'zod'

/**
 * 用户角色 —— 字符串枚举（等价 Python 的 StrEnum）
 * - user:   普通用户
 * - member: 会员用户（保留）
 * - admin:  管理员
 */
export enum UserRole {
  User = 'user',
  Member = 'member',
  Admin = 'admin',
}

export const userRoleValues = Object.values(UserRole)

/** 注册校验：用户名即邮箱，密码至少 6 位 */
export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email('邮箱格式不正确'),
  password: z.string().min(6, '密码至少 6 位'),
})

export type RegisterDto = z.infer<typeof registerSchema>

/** 登录校验 */
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('邮箱格式不正确'),
  password: z.string().min(1, '请输入密码'),
})

export type LoginDto = z.infer<typeof loginSchema>

/** 用户角色校验（供后续权限/改角色使用） */
export const userRoleSchema = z.enum(['user', 'member', 'admin'])
