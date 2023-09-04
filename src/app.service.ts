import { Inject, Injectable } from '@nestjs/common'
import { SlackService } from '~/slack/slack.service'
import dayjs from 'dayjs'
import { CaptureService } from '~/capture/capture.service'
import { filterEmojiSkinTone } from '~/lib/emojis'

@Injectable()
export class AppService {
  constructor(
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

    slackService.app.message(async ({ message, event }) => {
      if (message.subtype === 'message_deleted') return
      console.log(message)

      // don't capture @BuckBank commands
      // if (event..includes(`<@${botUsers.buckbank.slackId}>`)) return
      //
      // const foundEmojis: string[] = parseEmojis(text)
      // // no emojis, get outta here
      // if (foundEmojis.length > 0) {
      //   // persist emojis
      //   for (const emoji of foundEmojis) {
      //     await captureService.capture({
      //       emoji,
      //       user,
      //       channel,
      //       method: 'MESSAGE'
      //     })
      //   }
      // }
      //
      // const reactions = keywordToEmojis(text)
      // for (const reaction of reactions) {
      //   await this.slackService.react(reaction, ts, channel)
      // }
    })
  }
}
