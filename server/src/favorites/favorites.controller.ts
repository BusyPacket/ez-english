import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../common/jwt-auth.guard'
import { ZodValidationPipe } from '../common/zod-validation.pipe'
import { createFavoriteSchema, type CreateFavoriteDto } from './favorites.schema'
import { FavoritesService } from './favorites.service'

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  /** 收藏一道题（登录用户） */
  @Post()
  create(
    @Req() request: { user: { sub: string } },
    @Body(new ZodValidationPipe(createFavoriteSchema)) dto: CreateFavoriteDto,
  ) {
    return this.favoritesService.create(request.user.sub, dto)
  }

  /** 我的收藏列表（登录用户） */
  @Get()
  list(@Req() request: { user: { sub: string } }) {
    return this.favoritesService.listByUser(request.user.sub)
  }

  /** 取消收藏（登录用户，仅本人） */
  @Delete(':id')
  @HttpCode(204)
  remove(@Req() request: { user: { sub: string } }, @Param('id') id: string) {
    return this.favoritesService.remove(request.user.sub, id)
  }
}
