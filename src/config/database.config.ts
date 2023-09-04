import { ConfigType, registerAs } from '@nestjs/config'
import { Inject, Injectable, Module } from '@nestjs/common'
import {
  SequelizeModule,
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize'
import appConfig from '~/config/app.config'
import { User } from '~/models/user.model'
import { EmojiUsage } from '~/models/emoji-usage.model'
import { AllTimeEmojiUsage } from '~/models/all-time-emoji-usage.model'
import { DailyStock } from '~/models/daily-stock.model'
import { Stock } from '~/models/stock.model'
import { MonthlyEmojiUsage } from '~/models/monthly-emoji-usage.model'
import { SecretEmoji } from '~/models/secret-emoji.model'
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('pg').defaults.parseInt8 = true

export const databaseConfig = registerAs('database', () => ({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USERNAME || '',
  password: process.env.DATABASE_PASSWORD || '',
  name: process.env.DATABASE_NAME || '',
}))

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
  constructor(
    @Inject(appConfig.KEY)
    private readonly app: ConfigType<typeof appConfig>,
    @Inject(databaseConfig.KEY)
    private readonly config: ConfigType<typeof databaseConfig>,
  ) {}

  createSequelizeOptions(): SequelizeModuleOptions {
    const { host, port, username, password, name } = this.config

    return {
      dialect: 'postgres',
      host,
      port,
      username,
      password,
      database: name,
      autoLoadModels: true,
      synchronize: true,
      timezone: this.app.timezone,
      dialectOptions: {
        timezone: this.app.timezone,
        ssl: {
          require: process.env.NODE_ENV === 'production',
          rejectUnauthorized: false,
        },
      },
    }
  }
}

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      EmojiUsage,
      AllTimeEmojiUsage,
      DailyStock,
      Stock,
      MonthlyEmojiUsage,
      SecretEmoji,
    ]),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
