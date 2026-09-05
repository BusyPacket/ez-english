import { Injectable } from '@nestjs/common'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

/**
 * DeepSeek API 调用封装（OpenAI 兼容协议）。
 * 密钥只存在于服务端环境变量，绝不下发前端。
 *
 * 可选环境变量：DEEPSEEK_BASE_URL（默认 https://api.deepseek.com）
 */
@Injectable()
export class DeepSeekClient {
  private readonly baseUrl = process.env.DEEPSEEK_BASE_URL ?? 'https://api.deepseek.com'

  /** 调用 chat/completions，返回模型回复文本 */
  async chat(
    apiKey: string,
    model: string,
    messages: ChatMessage[],
    options?: { temperature?: number; jsonMode?: boolean },
  ): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options?.temperature ?? 0.7,
        // JSON 模式：生成题目时强制合法 JSON；追问等自由对话可关闭（jsonMode: false）
        ...(options?.jsonMode === false ? {} : { response_format: { type: 'json_object' } }),
      }),
    })

    if (!response.ok) {
      const detail = await response.text()
      // 余额不足：DeepSeek 返回 HTTP 402，或错误信息包含 balance/insufficient
      if (response.status === 402 || /insufficient|balance/i.test(detail)) {
        throw new Error('DeepSeek API 余额不足，请前往 platform.deepseek.com 充值或更换 API Key')
      }
      throw new Error(`DeepSeek API ${response.status}: ${detail.slice(0, 500)}`)
    }

    const data = (await response.json()) as { choices?: { message?: { content?: string } }[] }
    const content = data.choices?.[0]?.message?.content
    if (!content) {
      throw new Error('DeepSeek 返回内容为空')
    }
    return content
  }

  /** 调用 chat/completions，以增量文本流返回模型回复。 */
  async *chatStream(
    apiKey: string,
    model: string,
    messages: ChatMessage[],
    options?: { temperature?: number },
  ): AsyncGenerator<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options?.temperature ?? 0.7,
        stream: true,
      }),
    })

    if (!response.ok) {
      const detail = await response.text()
      if (response.status === 402 || /insufficient|balance/i.test(detail)) {
        throw new Error('DeepSeek API 余额不足，请前往 platform.deepseek.com 充值或更换 API Key')
      }
      throw new Error(`DeepSeek API ${response.status}: ${detail.slice(0, 500)}`)
    }
    if (!response.body) throw new Error('DeepSeek 未返回可读取的数据流')

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let finished = false
    try {
      while (!finished) {
        const { value, done } = await reader.read()
        buffer += decoder.decode(value, { stream: !done })
        const lines = buffer.split(/\r?\n/)
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.startsWith('data:')) continue
          const data = line.slice(5).trim()
          if (data === '[DONE]') {
            finished = true
            break
          }
          const chunk = JSON.parse(data) as {
            choices?: { delta?: { content?: string } }[]
          }
          const content = chunk.choices?.[0]?.delta?.content
          if (content) yield content
        }
        if (done) finished = true
      }
    } finally {
      reader.releaseLock()
    }
  }
}
