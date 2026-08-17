import { Body, Controller, Post } from '@nestjs/common'
import { ZodValidationPipe } from '../common/zod-validation.pipe'
import { loginSchema, registerSchema, type LoginDto, type RegisterDto } from '../users/user.schema'
import { UserService } from '../users/user.service'
import { AuthService } from './auth.service'

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
  async login(@Body(new ZodValidationPipe(loginSchema)) dto: LoginDto) {
    return this.authService.login(dto)
  }
}
