import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common'
import type { Response } from 'express'
import { JwtAuthGuard } from '../common/jwt-auth.guard'
import { ZodValidationPipe } from '../common/zod-validation.pipe'
import {
  generateFollowUpSchema,
  generatePracticeSchema,
  generateQuestionSchema,
  generateWritingSchema,
  reviewWritingSchema,
  type GenerateFollowUpDto,
  type GeneratePracticeDto,
  type GenerateQuestionDto,
  type GenerateWritingDto,
  type ReviewWritingDto,
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
    @Res() response: Response,
  ) {
    return this.writeStream(response, this.aiService.streamFollowUp(request.user.sub, dto))
  }

  /** 生成专升本作文题（写作练习页，登录用户可用） */
  @Post('generate-writing')
  generateWriting(
    @Req() request: { user: { sub: string } },
    @Body(new ZodValidationPipe(generateWritingSchema)) dto: GenerateWritingDto,
  ) {
    return this.aiService.generateWriting(request.user.sub, dto)
  }

  /** 点评英语作文（写作练习页，登录用户可用） */
  @Post('review-writing')
  reviewWriting(
    @Req() request: { user: { sub: string } },
    @Body(new ZodValidationPipe(reviewWritingSchema)) dto: ReviewWritingDto,
    @Res() response: Response,
  ) {
    return this.writeStream(response, this.aiService.streamReviewWriting(request.user.sub, dto))
  }

  private async writeStream(response: Response, chunks: AsyncGenerator<string>) {
    response.status(200).set({
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    })
    response.flushHeaders()
    try {
      for await (const content of chunks) {
        response.write(`data: ${JSON.stringify({ content })}\n\n`)
      }
      response.write('event: done\ndata: {}\n\n')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'AI 请求失败'
      response.write(`event: error\ndata: ${JSON.stringify({ message })}\n\n`)
    } finally {
      response.end()
    }
  }
}
