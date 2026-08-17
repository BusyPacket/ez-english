import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
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

/** 邮箱脱敏：保留前 2 位，中间用星号代替（如 fr******@example.com） */
function maskEmail(email: string): string {
  const atIndex = email.indexOf('@')
  if (atIndex <= 1) return email
  const local = email.slice(0, atIndex)
  const domain = email.slice(atIndex)
  const visible = local.slice(0, 2)
  return `${visible}${'*'.repeat(Math.max(local.length - visible.length, 4))}${domain}`
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const user = ref<User | null>(loadUser())

  const isLoggedIn = computed(() => !!token.value)
  const displayName = computed(
    () => user.value?.nickname || maskEmail(user.value?.email ?? '') || '',
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
