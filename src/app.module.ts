import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { SlackModule } from './slack/slack.module'
import { CaptureService } from './capture/capture.service'
import appConfig from '~/config/app.config'
import slackConfig from '~/config/slack.config'
import { SequelizeModule } from '@nestjs/sequelize'
import {
  databaseConfig,
  DatabaseModule,
  SequelizeConfigService,
} from '~/config/database.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, slackConfig],
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      useClass: SequelizeConfigService,
    }),
    DatabaseModule,
    SlackModule,
  ],
  controllers: [],
  providers: [AppService, CaptureService],
})
export class AppModule {}
