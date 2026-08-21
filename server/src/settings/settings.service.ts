import { Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { db, schema } from '../database/database'

/** 系统配置（settings KV 表）相关服务 */
@Injectable()
export class SettingsService {
  /** 注册是否开放（未设置时默认开放） */
  async getRegistrationOpen(): Promise<{ open: boolean }> {
    const value = await this.get('registration_open')
    return { open: value !== 'false' }
  }

  /** 免费试用天数（settings 表 trial_days 配置，未设置时默认 7，可修改） */
  async getTrialDays(): Promise<number> {
    const value = await this.get('trial_days')
    const n = value ? Number(value) : NaN
    return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 7
  }

  /** 设置注册开关 */
  async setRegistrationOpen(open: boolean) {
    await this.set('registration_open', String(open))
    return { open }
  }

  private async get(key: string): Promise<string | null> {
    const row = await db.select().from(schema.settings).where(eq(schema.settings.key, key)).get()
    return row?.value ?? null
  }

  private async set(key: string, value: string) {
    const updatedAt = new Date().toISOString()
    await db
      .insert(schema.settings)
      .values({ key, value, updatedAt })
      .onConflictDoUpdate({
        target: schema.settings.key,
        set: { value, updatedAt },
      })
      .run()
  }
}
