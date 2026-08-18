import { Injectable } from '@nestjs/common'

/**
 * IP 归属地查询：调用 ip-api.com 免费接口（http，仅服务端使用）。
 * 内网/本机 IP 直接标记「本机/内网」；查询失败返回 null（不阻塞登录）。
 */
@Injectable()
export class IpRegionService {
  /** 查询 IP 所在地区（拼接「国家 省 市」，中文） */
  async lookup(ip: string): Promise<string | null> {
    const clean = ip.replace(/^::ffff:/, '').trim()
    if (!clean) return null
    if (this.isPrivate(clean)) return '本机/内网'

    try {
      const url =
        `http://ip-api.com/json/${encodeURIComponent(clean)}` +
        `?lang=zh-CN&fields=status,country,regionName,city`
      const res = await fetch(url)
      if (!res.ok) return null
      const data = (await res.json()) as {
        status?: string
        country?: string
        regionName?: string
        city?: string
      }
      if (data.status !== 'success') return null
      return [data.country, data.regionName, data.city].filter(Boolean).join(' ')
    } catch {
      return null
    }
  }

  /** 是否为本机/内网/保留地址（无需外网查询） */
  private isPrivate(ip: string): boolean {
    return (
      ip === 'localhost' ||
      /^::1$/.test(ip) ||
      /^127\./.test(ip) ||
      /^10\./.test(ip) ||
      /^192\.168\./.test(ip) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ||
      /^0\./.test(ip) ||
      /^169\.254\./.test(ip)
    )
  }
}
