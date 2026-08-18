import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../common/jwt-auth.guard'
import { ZodValidationPipe } from '../common/zod-validation.pipe'
import {
  generateFollowUpSchema,
  generatePracticeSchema,
  generateQuestionSchema,
  type GenerateFollowUpDto,
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

  /** 追问：携带多轮上下文回答新问题（登录用户可用） */
  @Post('follow-up')
  generateFollowUp(
    @Req() request: { user: { sub: string } },
    @Body(new ZodValidationPipe(generateFollowUpSchema)) dto: GenerateFollowUpDto,
  ) {
    return this.aiService.generateFollowUp(request.user.sub, dto)
  }
}
