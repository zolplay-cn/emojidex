import { Inject, Injectable } from '@nestjs/common'
import { SlackService } from '~/slack/slack.service'
import dayjs from 'dayjs'
import { CaptureService } from '~/capture/capture.service'
import { filterEmojiSkinTone, keywordToEmojis, parseEmojis } from '~/lib/emojis'
import { GenericMessageEvent } from '@slack/bolt'
import slackConfig from '~/config/slack.config'
import { ConfigType } from '@nestjs/config'

@Injectable()
export class AppService {
  constructor(
    @Inject(slackConfig.KEY)
    private readonly slackConf: ConfigType<typeof slackConfig>,
    @Inject(SlackService)
    private readonly slackService: SlackService,
    @Inject(CaptureService)
    private readonly captureService: CaptureService,
  ) {
    slackService.app.event('reaction_added', async ({ event }) => {
      const messageDateTime = dayjs.unix(Number(event.item.ts))
      // get the difference in days between the message and now
      const diffInDays = dayjs().diff(messageDateTime, 'day', true)
      // if the difference is greater than 1 day, return
      if (Math.abs(diffInDays) > 1) return

      const channel = event.item.channel

      await captureService.capture({
        user: event.user,
        emoji: filterEmojiSkinTone(event.reaction),
        channel,
        method: 'REACTION',
      })
    })

    slackService.app.message(async ({ message }) => {
      if (message.subtype === 'message_deleted') return
      if (message.type !== 'message') return

      const { text, user, channel, ts } = message as GenericMessageEvent
      // don't capture @BuckBank text commands
      if (slackConf.buckBankId && text.includes(`<@${slackConf.buckBankId}>`)) {
        return
      }

      const foundEmojis: string[] = parseEmojis(text)
      // no emojis, get outta here
      if (foundEmojis.length > 0) {
        // persist emojis
        for (const emoji of foundEmojis) {
          await captureService.capture({
            emoji,
            user,
            channel,
            method: 'MESSAGE',
          })
        }
      }

      const reactions = keywordToEmojis(text)
      for (const reaction of reactions) {
        await this.slackService.react(reaction, ts, channel)
      }
    })
  }
}
