const BASE_URL = import.meta.env.VITE_API_BASE ?? 'http://localhost:3000/api'

export interface ApiError {
  message?: string | string[]
  error?: string
  statusCode?: number
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
    ...options,
  })
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as ApiError
    const msg = body.message ?? `请求失败 (${res.status})`
    throw new Error(Array.isArray(msg) ? msg.join('；') : msg)
  }
  return (await res.json()) as T
}
