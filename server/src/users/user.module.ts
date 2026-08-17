import { Module } from '@nestjs/common'
import { ProfileController } from './profile.controller'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  controllers: [UserController, ProfileController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
