import { BadRequestException, Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { db, schema } from '../database/database'
import { AiProvider, aiProviderMeta } from './user.schema'

/** DeepSeek API 基础地址（官方文档） */
const DEEPSEEK_API = 'https://api.deepseek.com'

/** 用户 AI 配置（profile 表）相关服务 */
@Injectable()
export class ProfileService {
  /** 返回所有 AI 公司及模型选项（供前端动态渲染下拉） */
  getAiOptions() {
    const providers = Object.values(AiProvider).map((value) => {
      const meta = aiProviderMeta[value]
      return {
        value,
        label: meta.label,
        platformUrl: meta.platformUrl,
        models: meta.models,
      }
    })
    return { providers }
  }

  /**
   * 实时获取当前用户可用的 AI 模型：
   * - 已保存有效 API Key → 调用 DeepSeek /models 实时拉取
   * - 未保存 key / key 无效 / 网络失败 → 回退内置模型
   */
  async getAiModels(userId: string) {
    const row = await db
      .select()
      .from(schema.profiles)
      .where(eq(schema.profiles.userId, userId))
      .get()
    if (row?.apiKey) {
      try {
        const res = await fetch(`${DEEPSEEK_API}/models`, {
          headers: { Authorization: `Bearer ${row.apiKey}`, Accept: 'application/json' },
        })
        if (res.ok) {
          const data = (await res.json()) as { data?: { id: string }[] }
          const models = (data.data ?? [])
            .map((m) => m.id)
            .filter((id): id is string => !!id)
            .map((value) => ({ value, label: value }))
          if (models.length) {
            return { models, source: 'live' }
          }
        }
      } catch {
        // 网络失败，走兜底
      }
    }
    // 兜底：内置模型（官方文档）
    return { models: aiProviderMeta[AiProvider.DeepSeek].models, source: 'fallback' }
  }

  /** 获取当前用户的 AI 配置（不返回完整 API Key，仅标记是否已设置） */
  async getAiConfig(userId: string) {
    const row = await db
      .select()
      .from(schema.profiles)
      .where(eq(schema.profiles.userId, userId))
      .get()
    return {
      aiProvider: row?.aiProvider ?? 'deepseek',
      model: row?.model ?? 'deepseek-v4-flash',
      hasApiKey: !!row?.apiKey,
    }
  }

  /** 保存/更新当前用户的 AI 配置（upsert）：apiKey 不传时保留原值 */
  async upsertAiConfig(
    userId: string,
    dto: { aiProvider: string; model: string; apiKey?: string },
  ) {
    const existing = await db
      .select()
      .from(schema.profiles)
      .where(eq(schema.profiles.userId, userId))
      .get()
    // 传入新 key 则更新；否则保留已保存的 key
    const apiKey = dto.apiKey?.trim() ? dto.apiKey.trim() : existing?.apiKey
    if (!apiKey) {
      throw new BadRequestException('请先输入 API Key')
    }
    const updatedAt = new Date().toISOString()
    await db
      .insert(schema.profiles)
      .values({
        userId,
        aiProvider: dto.aiProvider,
        model: dto.model,
        apiKey,
        updatedAt,
      })
      .onConflictDoUpdate({
        target: schema.profiles.userId,
        set: { aiProvider: dto.aiProvider, model: dto.model, apiKey, updatedAt },
      })
      .run()
    return { message: 'AI 配置已保存' }
  }

  /** 获取当前用户的 AI 调用配置（API Key + 模型），供 AI 生成功能使用；未配置则报错 */
  async getChatConfig(userId: string): Promise<{ apiKey: string; model: string }> {
    const row = await db
      .select()
      .from(schema.profiles)
      .where(eq(schema.profiles.userId, userId))
      .get()
    if (!row?.apiKey) {
      throw new BadRequestException('请先在个人资料中保存 API Key')
    }
    return { apiKey: row.apiKey, model: row.model }
  }

  /** 取当前用户已保存的 API Key（未设置则报错） */
  private async getApiKey(userId: string): Promise<string> {
    const row = await db
      .select()
      .from(schema.profiles)
      .where(eq(schema.profiles.userId, userId))
      .get()
    if (!row?.apiKey) {
      throw new BadRequestException('请先在个人资料中保存 API Key')
    }
    return row.apiKey
  }

  /** 检测 API Key 是否可用（调用 DeepSeek /models） */
  async verifyApiKey(userId: string) {
    const apiKey = await this.getApiKey(userId)
    try {
      const res = await fetch(`${DEEPSEEK_API}/models`, {
        headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' },
      })
      if (res.ok) return { valid: true, message: 'API Key 有效' }
      if (res.status === 401) return { valid: false, message: 'API Key 无效或已过期' }
      return { valid: false, message: `验证失败（HTTP ${res.status}）` }
    } catch {
      throw new BadRequestException('网络错误，无法连接 DeepSeek 服务')
    }
  }

  /** 查询余额（调用 DeepSeek /user/balance） */
  async getBalance(userId: string) {
    const apiKey = await this.getApiKey(userId)
    try {
      const res = await fetch(`${DEEPSEEK_API}/user/balance`, {
        headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' },
      })
      if (res.status === 401) throw new BadRequestException('API Key 无效或已过期')
      if (!res.ok) throw new BadRequestException(`查询失败（HTTP ${res.status}）`)
      const data = (await res.json()) as {
        is_available?: boolean
        balance_infos?: {
          currency?: string
          total_balance?: string
          granted_balance?: string
          topped_up_balance?: string
        }[]
      }
      return {
        isAvailable: data.is_available ?? false,
        balances: (data.balance_infos ?? []).map((b) => ({
          currency: b.currency ?? 'CNY',
          total: b.total_balance ?? '0',
          granted: b.granted_balance ?? '0',
          toppedUp: b.topped_up_balance ?? '0',
        })),
      }
    } catch (e) {
      if (e instanceof BadRequestException) throw e
      throw new BadRequestException('网络错误，无法连接 DeepSeek 服务')
    }
  }
}
