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
    // listen for reactions
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

    // listen for messages
    slackService.app.message(async ({ message }) => {
      if (message.subtype === 'message_deleted') return
      if (message.type !== 'message') return

      const { text, user, channel, ts } = message as GenericMessageEvent
      // don't capture @BuckBank text commands
      if (slackConf.buckBankId && text.includes(`<@${slackConf.buckBankId}>`)) {
        return
      }

      const foundEmojis = parseEmojis(text)
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

    // listen for slash commands
    slackService.app.command('/emoji_usage', async ({ ack, command, say }) => {
      await ack()

      let response = ''
      const emojis = parseEmojis(command.text)
      for (const emoji of emojis) {
        const { allTime, monthly } = await captureService.getEmojiUsage(emoji)
        if (allTime === 0) {
          response += `- :${emoji}:：从未被用过\n`
          continue
        }

        response += `- :${emoji}:：本月被用过 *${monthly}* 次，一共被用过 *${allTime}* 次\n`
      }

      if (response === '') {
        response = '请输入至少一个 emoji'
      } else {
        response = `*表情用量如下*\n${response}`
      }

      await say({
        text: `<@${command.user_id}> ${response}`,
        mrkdwn: true,
      })
    })
  }
}
