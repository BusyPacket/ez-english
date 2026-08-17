import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../common/jwt-auth.guard'
import { RolesGuard } from '../common/roles.guard'
import { Roles } from '../common/roles.decorator'
import { UserRole } from '../users/user.schema'
import { ZodValidationPipe } from '../common/zod-validation.pipe'
import {
  createFeedbackSchema,
  updateFeedbackStatusSchema,
  type CreateFeedbackDto,
  type UpdateFeedbackStatusDto,
} from './feedback.schema'
import { FeedbackService } from './feedback.service'

interface AuthedRequest {
  user: { sub: string }
}

@Controller('feedback')
@UseGuards(JwtAuthGuard)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  create(
    @Req() request: AuthedRequest,
    @Body(new ZodValidationPipe(createFeedbackSchema)) dto: CreateFeedbackDto,
  ) {
    return this.feedbackService.create(request.user.sub, dto)
  }

  @Get('my')
  getMy(@Req() request: AuthedRequest) {
    return this.feedbackService.listByUser(request.user.sub)
  }

  // —— 以下接口仅管理员可用 ——
  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin)
  getAll() {
    return this.feedbackService.listAll()
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin)
  updateStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateFeedbackStatusSchema)) dto: UpdateFeedbackStatusDto,
  ) {
    return this.feedbackService.updateStatus(id, dto.status)
  }
}
