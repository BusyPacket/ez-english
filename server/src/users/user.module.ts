import { Module } from '@nestjs/common'
import { SettingsModule } from '../settings/settings.module'
import { IpRegionService } from './ip-region.service'
import { ProfileController } from './profile.controller'
import { ProfileService } from './profile.service'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [SettingsModule],
  controllers: [UserController, ProfileController],
  providers: [UserService, ProfileService, IpRegionService],
  exports: [UserService, ProfileService, IpRegionService],
})
export class UserModule {}
