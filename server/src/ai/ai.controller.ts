import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../common/jwt-auth.guard'
import { ZodValidationPipe } from '../common/zod-validation.pipe'
import { generateQuestionSchema, type GenerateQuestionDto } from './ai.schema'
import { AiService } from './ai.service'

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  /** 根据参考例题生成一道同类题目（登录用户可用） */
  @Post('generate-question')
  generateQuestion(
    @Req() request: { user: { sub: string } },
    @Body(new ZodValidationPipe(generateQuestionSchema)) dto: GenerateQuestionDto,
  ) {
    return this.aiService.generateQuestion(request.user.sub, dto)
  }
}
