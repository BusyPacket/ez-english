import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../common/jwt-auth.guard'
import { PapersService } from './papers.service'

@Controller('papers')
@UseGuards(JwtAuthGuard)
export class PapersController {
  constructor(private readonly papersService: PapersService) {}

  @Get()
  getAllYears() {
    return this.papersService.getAllYears()
  }

  @Get(':year')
  getPaper(@Param('year') year: string) {
    return this.papersService.getPaper(Number(year))
  }
}
