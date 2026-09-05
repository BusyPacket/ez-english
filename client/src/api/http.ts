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

/** 读取后端 SSE 文本流；每收到一段内容就调用 onChunk。 */
export async function streamApi(
  path: string,
  options: RequestInit,
  onChunk: (content: string) => void,
): Promise<void> {
  const token = localStorage.getItem('ez-token')
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> | undefined),
    },
    ...options,
  })
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as ApiError
    const msg = body.message ?? `请求失败 (${res.status})`
    throw new Error(Array.isArray(msg) ? msg.join('；') : msg)
  }
  if (!res.body) throw new Error('服务器未返回数据流')

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let event = 'message'
  try {
    while (true) {
      const { value, done } = await reader.read()
      buffer += decoder.decode(value, { stream: !done })
      const lines = buffer.split(/\r?\n/)
      buffer = lines.pop() ?? ''
      for (const line of lines) {
        if (line.startsWith('event:')) event = line.slice(6).trim()
        if (!line.startsWith('data:')) continue
        const data = JSON.parse(line.slice(5).trim()) as { content?: string; message?: string }
        if (event === 'error') throw new Error(data.message ?? 'AI 请求失败')
        if (event !== 'done' && data.content) onChunk(data.content)
        event = 'message'
      }
      if (done) break
    }
  } finally {
    reader.releaseLock()
  }
}
