import { Body, Controller, Delete, Get, Param, Put, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../common/jwt-auth.guard'
import { RolesGuard } from '../common/roles.guard'
import { Roles } from '../common/roles.decorator'
import { ZodValidationPipe } from '../common/zod-validation.pipe'
import { UserRole } from '../users/user.schema'
import { updateQuestionSchema, type UpdateQuestionDto } from './questions.schema'
import { QuestionsService } from './questions.service'

@Controller('questions')
@UseGuards(JwtAuthGuard)
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  /** 例题列表：?pointId=考点id&limit=数量（随机抽取） */
  @Get()
  list(@Query('pointId') pointId?: string, @Query('limit') limit?: string) {
    return this.questionsService.random(limit ? Number(limit) : 10, pointId)
  }

  /** 例题管理分页列表（admin）：?page=&pageSize=&keyword=，返回精简预览 */
  @Get('admin/list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  adminList(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('keyword') keyword?: string,
    @Query('pointId') pointId?: string,
  ) {
    return this.questionsService.adminList(
      Number(page) || 1,
      Number(pageSize) || 10,
      keyword?.trim() || undefined,
      pointId || undefined,
    )
  }

  /** 更新例题（admin 编辑） */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateQuestionSchema)) dto: UpdateQuestionDto,
  ) {
    return this.questionsService.update(id, dto)
  }

  /** 删除例题（admin 编辑） */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  remove(@Param('id') id: string) {
    return this.questionsService.remove(id)
  }

  /** 例题详情 */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionsService.findOne(id)
  }
}
