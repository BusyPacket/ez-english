import { Module } from '@nestjs/common'
import { QuestionsModule } from '../questions/questions.module'
import { SettingsModule } from '../settings/settings.module'
import { UserModule } from '../users/user.module'
import { AiController } from './ai.controller'
import { AiService } from './ai.service'
import { AiGenerationCacheService } from './ai-generation-cache.service'
import { DeepSeekClient } from './deepseek'

@Module({
  imports: [UserModule, QuestionsModule, SettingsModule],
  controllers: [AiController],
  providers: [AiService, AiGenerationCacheService, DeepSeekClient],
  exports: [AiService],
})
export class AiModule {}
