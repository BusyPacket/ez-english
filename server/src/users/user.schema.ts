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

/** 昵称校验：1-20 位，仅中文/字母/数字/下划线，不允许特殊字符 */
export const nicknameSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(1, '昵称不能为空')
    .max(20, '昵称最长 20 个字符')
    .regex(/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/, '昵称仅支持中文、字母、数字和下划线，不能包含特殊字符'),
})

export type NicknameDto = z.infer<typeof nicknameSchema>

/** 修改密码校验：当前密码非空、新密码至少 6 位、两次输入一致 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, '请输入当前密码'),
    newPassword: z.string().min(6, '新密码至少 6 位'),
    confirmPassword: z.string().min(1, '请再次输入新密码'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: '两次输入的新密码不一致',
  })

export type ChangePasswordDto = z.infer<typeof changePasswordSchema>
