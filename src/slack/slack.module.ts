import { Global, Module } from '@nestjs/common'
import { SlackService } from '~/slack/slack.service'

@Global()
@Module({
  providers: [SlackService],
  exports: [SlackService],
})
export class SlackModule {}
