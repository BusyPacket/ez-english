import { Body, Controller, Delete, Get, HttpCode, Param, Put } from '@nestjs/common'
import { ZodValidationPipe } from '../common/zod-validation.pipe'
import { updateProgressSchema, type UpdateProgressDto } from './progress.schema'
import { ProgressService } from './progress.service'

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  getAll() {
    return this.progressService.getAll()
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.progressService.getOne(id)
  }

  @Put(':id')
  upsert(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateProgressSchema)) dto: UpdateProgressDto,
  ) {
    return this.progressService.upsert(id, dto)
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.progressService.remove(id)
  }
}
