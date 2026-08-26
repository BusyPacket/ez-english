import { Module } from '@nestjs/common'
import { QuestionsModule } from '../questions/questions.module'
import { UserModule } from '../users/user.module'
import { AiController } from './ai.controller'
import { AiService } from './ai.service'
import { DeepSeekClient } from './deepseek'

@Module({
  imports: [UserModule, QuestionsModule],
  controllers: [AiController],
  providers: [AiService, DeepSeekClient],
  exports: [AiService],
})
export class AiModule {}
