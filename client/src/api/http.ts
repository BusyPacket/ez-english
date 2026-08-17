const BASE_URL = import.meta.env.VITE_API_BASE ?? 'http://localhost:3000/api'

export interface ApiError {
  message?: string | string[]
  error?: string
  statusCode?: number
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('ez-token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> | undefined),
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    headers,
    ...options,
  })
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as ApiError
    const msg = body.message ?? `请求失败 (${res.status})`
    throw new Error(Array.isArray(msg) ? msg.join('；') : msg)
  }
  // 204 No Content：无响应体，跳过 JSON 解析
  if (res.status === 204) {
    return undefined as T
  }
  return (await res.json()) as T
}
