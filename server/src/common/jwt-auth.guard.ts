import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

/** 校验请求头中的 Bearer JWT，并把 payload 挂到 request.user */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const auth = request.headers.authorization as string | undefined
    if (!auth?.startsWith('Bearer ')) {
      throw new UnauthorizedException('未登录')
    }
    const token = auth.slice(7)
    try {
      request.user = await this.jwtService.verifyAsync(token)
      return true
    } catch {
      throw new UnauthorizedException('登录已过期，请重新登录')
    }
  }
}
