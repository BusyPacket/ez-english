import { Module } from '@nestjs/common'
import { ProfileController } from './profile.controller'
import { ProfileService } from './profile.service'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  controllers: [UserController, ProfileController],
  providers: [UserService, ProfileService],
  exports: [UserService, ProfileService],
})
export class UserModule {}
