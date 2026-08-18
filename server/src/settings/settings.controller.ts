import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../common/jwt-auth.guard'
import { RolesGuard } from '../common/roles.guard'
import { Roles } from '../common/roles.decorator'
import { UserRole } from '../users/user.schema'
import { ZodValidationPipe } from '../common/zod-validation.pipe'
import { updateRegistrationOpenSchema, type UpdateRegistrationOpenDto } from './settings.schema'
import { SettingsService } from './settings.service'

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  /** 注册是否开放（公开接口，注册页/导航栏读取） */
  @Get('registration-open')
  getRegistrationOpen() {
    return this.settingsService.getRegistrationOpen()
  }

  /** 设置注册开关（仅管理员） */
  @Put('registration-open')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  setRegistrationOpen(
    @Body(new ZodValidationPipe(updateRegistrationOpenSchema)) dto: UpdateRegistrationOpenDto,
  ) {
    return this.settingsService.setRegistrationOpen(dto.open)
  }
}
