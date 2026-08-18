import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ProgressModule } from './progress/progress.module'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './users/user.module'
import { PapersModule } from './papers/papers.module'
import { FeedbackModule } from './feedback/feedback.module'
import { AiModule } from './ai/ai.module'
import { SettingsModule } from './settings/settings.module'
import { FavoritesModule } from './favorites/favorites.module'

@Module({
  imports: [
    ProgressModule,
    UserModule,
    AuthModule,
    PapersModule,
    FeedbackModule,
    AiModule,
    SettingsModule,
    FavoritesModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET ?? 'ez-english-dev-secret',
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
