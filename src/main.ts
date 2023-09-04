import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { SlackService } from '~/slack/slack.service'
import { Logger } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = app.get(ConfigService)
  await app.get(SlackService).app.start(config.get<number>('app.port', 3000))

  Logger.log('⚡️ Bolt app is running!')
}
bootstrap()
