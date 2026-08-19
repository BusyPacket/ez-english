import { Body, Controller, Get, Patch, Post, Put, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../common/jwt-auth.guard'
import { ZodValidationPipe } from '../common/zod-validation.pipe'
import {
  aiConfigSchema,
  changePasswordSchema,
  nicknameSchema,
  type AiConfigDto,
  type ChangePasswordDto,
  type NicknameDto,
} from '../users/user.schema'
import { ProfileService } from './profile.service'
import { UserService } from '../users/user.service'

/** 当前登录用户的个人资料（非管理员接口） */
@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
  ) {}

  /** 当前用户资料（含答题数） */
  @Get()
  getProfile(@Req() req: { user: { sub: string } }) {
    return this.userService.getProfile(req.user.sub)
  }

  @Patch('nickname')
  updateNickname(
    @Req() req: { user: { sub: string } },
    @Body(new ZodValidationPipe(nicknameSchema)) dto: NicknameDto,
  ) {
    return this.userService.updateNickname(req.user.sub, dto.nickname)
  }

  @Patch('password')
  updatePassword(
    @Req() req: { user: { sub: string } },
    @Body(new ZodValidationPipe(changePasswordSchema)) dto: ChangePasswordDto,
  ) {
    return this.userService.updatePassword(req.user.sub, dto.currentPassword, dto.newPassword)
  }

  /** 答题数 +1（提交一道题目时上报） */
  @Post('answer')
  incrementAnswer(@Req() req: { user: { sub: string } }) {
    return this.userService.incrementAnswerCount(req.user.sub)
  }

  @Get('ai-options')
  getAiOptions() {
    return this.profileService.getAiOptions()
  }

  @Get('ai-config/models')
  getAiModels(@Req() req: { user: { sub: string } }) {
    return this.profileService.getAiModels(req.user.sub)
  }

  @Get('ai-config')
  getAiConfig(@Req() req: { user: { sub: string } }) {
    return this.profileService.getAiConfig(req.user.sub)
  }

  @Put('ai-config')
  updateAiConfig(
    @Req() req: { user: { sub: string } },
    @Body(new ZodValidationPipe(aiConfigSchema)) dto: AiConfigDto,
  ) {
    return this.profileService.upsertAiConfig(req.user.sub, dto)
  }

  @Post('ai-config/verify')
  verifyAiConfig(@Req() req: { user: { sub: string } }) {
    return this.profileService.verifyApiKey(req.user.sub)
  }

  @Get('ai-config/balance')
  getAiConfigBalance(@Req() req: { user: { sub: string } }) {
    return this.profileService.getBalance(req.user.sub)
  }
}
