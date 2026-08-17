import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../common/jwt-auth.guard'
import { ZodValidationPipe } from '../common/zod-validation.pipe'
import {
  changePasswordSchema,
  nicknameSchema,
  type ChangePasswordDto,
  type NicknameDto,
} from '../users/user.schema'
import { UserService } from '../users/user.service'

/** 当前登录用户的个人资料（非管理员接口） */
@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly userService: UserService) {}

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
}
