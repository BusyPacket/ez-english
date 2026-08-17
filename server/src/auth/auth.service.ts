import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../users/user.service'
import type { LoginDto } from '../users/user.schema'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email)
    if (!user || !this.userService.verifyPassword(dto.password, user.passwordHash)) {
      throw new UnauthorizedException('邮箱或密码错误')
    }

    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    })

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        role: user.role,
        createdAt: user.createdAt,
      },
    }
  }
}
