import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../common/jwt-auth.guard'
import { RolesGuard } from '../common/roles.guard'
import { Roles } from '../common/roles.decorator'
import { UserRole } from './user.schema'
import { UserService } from './user.service'

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Admin)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '10',
    @Query('keyword') keyword = '',
  ) {
    return this.userService.listUsers(Number(page), Number(pageSize), keyword)
  }

  @Delete(':id')
  @HttpCode(204)
  async removeUser(@Param('id') id: string, @Req() request: { user?: { sub?: string } }) {
    if (id === request.user?.sub) {
      throw new BadRequestException('不能删除当前登录账号')
    }
    await this.userService.remove(id)
  }
}
