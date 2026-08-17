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

  async function login(email: string, password: string) {
    const result = await api<LoginResult>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    token.value = result.token
    user.value = result.user
    localStorage.setItem(TOKEN_KEY, result.token)
    localStorage.setItem(USER_KEY, JSON.stringify(result.user))
  }

  async function register(email: string, password: string) {
    await api<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  return { token, user, isLoggedIn, displayName, login, register, logout }
})
