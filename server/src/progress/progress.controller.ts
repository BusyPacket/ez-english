import { Body, Controller, Get, Param, Put, Query, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../common/jwt-auth.guard'
import { ZodValidationPipe } from '../common/zod-validation.pipe'
import { updateProgressSchema, type UpdateProgressDto } from './progress.schema'
import { ProgressService } from './progress.service'

interface AuthedRequest {
  user: { sub: string }
}

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  getAll(@Req() request: AuthedRequest) {
    return this.progressService.getAll(request.user.sub)
  }

  @Get('summary')
  getSummary(@Req() request: AuthedRequest) {
    return this.progressService.getSummary(request.user.sub)
  }

  @Get('leaderboard')
  getLeaderboard(@Query('type') type?: string) {
    return this.progressService.getLeaderboard(type === 'answer' ? 'answer' : 'progress')
  }

  @Put(':pointId')
  upsert(
    @Param('pointId') pointId: string,
    @Body(new ZodValidationPipe(updateProgressSchema)) dto: UpdateProgressDto,
    @Req() request: AuthedRequest,
  ) {
    return this.progressService.upsert(request.user.sub, pointId, dto)
  }
}
