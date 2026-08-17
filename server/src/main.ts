import { NestFactory } from '@nestjs/core'
import { join } from 'node:path'
import { migrate } from 'drizzle-orm/libsql/migrator'
import { AppModule } from './app.module'
import { db } from './database/database'

async function bootstrap() {
  // 应用数据库迁移（幂等，已应用的迁移会跳过）
  await migrate(db, { migrationsFolder: join(process.cwd(), 'drizzle') })

  const app = await NestFactory.create(AppModule)
  app.enableCors()
  app.setGlobalPrefix('api')
  const port = Number(process.env.PORT) || 3000
  await app.listen(port)
  console.log(`ez-english API running at http://localhost:${port}/api`)
}

void bootstrap()
