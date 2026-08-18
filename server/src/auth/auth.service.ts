import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../users/user.service'
import { IpRegionService } from '../users/ip-region.service'
import type { LoginDto } from '../users/user.schema'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly ipRegionService: IpRegionService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto, clientIp: string) {
    const user = await this.userService.findByEmail(dto.email)
    if (!user || !this.userService.verifyPassword(dto.password, user.passwordHash)) {
      throw new UnauthorizedException('邮箱或密码错误')
    }

    // 记录登录信息：IP 地区查询失败不阻塞登录
    const region = await this.ipRegionService.lookup(clientIp)
    const lastActiveAt = new Date().toISOString()
    await this.userService.recordLogin(user.id, clientIp, region, lastActiveAt)

    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    })

    return {
      token,
      user: {
        // 登录 IP / 地区 / 活跃时间仅管理员列表可见，不随登录响应下发到普通前端
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        role: user.role,
        createdAt: user.createdAt,
      },
    }
  }
}
