import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../common/jwt-auth.guard'
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

  /** 例题详情 */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionsService.findOne(id)
  }
}
