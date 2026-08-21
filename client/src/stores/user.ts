import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { displayName as resolveDisplayName } from '@ez-english/shared'
import { api } from '@/api/http'

export interface User {
  id: string
  email: string
  nickname: string | null
  role: string
  createdAt: string
  answerCount?: number
  // 免费试用期信息（普通用户）：配置天数 / 是否已到期 / 剩余毫秒（会员与管理员为 null）
  trialDays?: number
  trialExpired?: boolean
  trialRemainingMs?: number | null
}

interface LoginResult {
  token: string
  user: User
}

const TOKEN_KEY = 'ez-token'
const USER_KEY = 'ez-user'

function loadUser(): User | null {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) ?? 'null') as User | null
  } catch {
    return null
  }
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const user = ref<User | null>(loadUser())

  const isLoggedIn = computed(() => !!token.value)
  // 展示名：昵称优先，否则脱敏邮箱（通用函数，与排行榜一致）
  const displayName = computed(() =>
    resolveDisplayName(user.value?.nickname ?? null, user.value?.email ?? ''),
  )
  // AI 是否可用：仅当已配置 API Key 且检测有效时为 true
  const aiAvailable = ref(false)

  /** 刷新 AI 可用状态：有 API Key 且检测可用才为 true */
  async function refreshAiAvailable() {
    if (!token.value) {
      aiAvailable.value = false
      return
    }
    // 普通用户试用期已到：禁用 AI（会员/管理员不受限）
    if (user.value?.role === 'user' && user.value.trialExpired) {
      aiAvailable.value = false
      return
    }
    try {
      const cfg = await api<{ hasApiKey: boolean }>('/profile/ai-config')
      if (!cfg.hasApiKey) {
        aiAvailable.value = false
        return
      }
      const res = await api<{ valid: boolean }>('/profile/ai-config/verify', { method: 'POST' })
      aiAvailable.value = res.valid
    } catch {
      aiAvailable.value = false
    }
  }

  /** 手动设置 AI 可用状态（如检测 Key 后直接更新） */
  function setAiAvailable(available: boolean) {
    aiAvailable.value = available
  }

  async function login(email: string, password: string) {
    const result = await api<LoginResult>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    token.value = result.token
    user.value = result.user
    localStorage.setItem(TOKEN_KEY, result.token)
    localStorage.setItem(USER_KEY, JSON.stringify(result.user))
    void refreshAiAvailable()
  }

  async function register(email: string, password: string) {
    await api<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  /** 修改昵称：成功后同步本地用户信息 */
  async function updateNickname(nickname: string) {
    const updated = await api<User>('/profile/nickname', {
      method: 'PATCH',
      body: JSON.stringify({ nickname }),
    })
    user.value = updated
    localStorage.setItem(USER_KEY, JSON.stringify(updated))
    return updated
  }

  /** 用最新资料更新本地用户（含答题数等，写回缓存） */
  function setProfile(profile: User) {
    user.value = profile
    localStorage.setItem(USER_KEY, JSON.stringify(profile))
  }

  /** 修改密码：校验当前密码并更新为新密码 */
  async function changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) {
    await api('/profile/password', {
      method: 'PATCH',
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
    })
  }

  function logout() {
    token.value = null
    user.value = null
    aiAvailable.value = false
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  return {
    token,
    user,
    isLoggedIn,
    displayName,
    aiAvailable,
    refreshAiAvailable,
    setAiAvailable,
    login,
    register,
    updateNickname,
    setProfile,
    changePassword,
    logout,
  }
})
