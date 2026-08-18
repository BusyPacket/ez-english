import { Body, Controller, Post, Req } from '@nestjs/common'
import type { Request } from 'express'
import { ZodValidationPipe } from '../common/zod-validation.pipe'
import { loginSchema, registerSchema, type LoginDto, type RegisterDto } from '../users/user.schema'
import { UserService } from '../users/user.service'
import { AuthService } from './auth.service'

/** 取客户端 IP：优先 X-Forwarded-For，其次 socket 地址 / express req.ip */
function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string') {
    const first = forwarded.split(',')[0].trim()
    if (first) return first
  }
  return req.ip ?? req.socket?.remoteAddress ?? ''
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body(new ZodValidationPipe(registerSchema)) dto: RegisterDto) {
    return this.userService.create(dto)
  }

  @Post('login')
  async login(@Req() request: Request, @Body(new ZodValidationPipe(loginSchema)) dto: LoginDto) {
    return this.authService.login(dto, getClientIp(request))
  }
}
