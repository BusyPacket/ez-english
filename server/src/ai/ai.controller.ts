import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../common/jwt-auth.guard'
import { ZodValidationPipe } from '../common/zod-validation.pipe'
import {
  generatePracticeSchema,
  generateQuestionSchema,
  type GeneratePracticeDto,
  type GenerateQuestionDto,
} from './ai.schema'
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

  /** 按考点与题型生成练习例题（登录用户可用） */
  @Post('generate-practice')
  generatePractice(
    @Req() request: { user: { sub: string } },
    @Body(new ZodValidationPipe(generatePracticeSchema)) dto: GeneratePracticeDto,
  ) {
    return this.aiService.generatePractice(request.user.sub, dto)
  }
}
