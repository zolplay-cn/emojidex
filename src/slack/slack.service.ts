import { Inject, Injectable } from '@nestjs/common'
import { App, LogLevel } from '@slack/bolt'
import slackConfig from '~/config/slack.config'
import { ConfigType } from '@nestjs/config'

@Injectable()
export class SlackService {
  constructor(
    @Inject(slackConfig.KEY)
    private readonly config: ConfigType<typeof slackConfig>,
  ) {
    this.app = new App({
      token: config.token,
      appToken: config.appToken,
      signingSecret: config.signingSecret,
      logLevel: LogLevel.INFO,
      socketMode: true,
    })
  }

  readonly app: App

  /**
   * Send a message to the given channel.
   *
   * @param message
   * @param channel
   */
  async postMessage(message: string | any[], channel: string) {
    try {
      if (typeof message === 'string') {
        await this.app.client.chat.postMessage({
          text: message,
          channel,
          token: this.config.token,
        })
        return
      }

      await this.app.client.chat.postMessage({
        text: '',
        blocks: message,
        channel,
        token: this.config.token,
      })
    } catch {}
  }

  /**
   * Send a reaction to the given channel and timestamp.
   *
   * @param emoji
   * @param ts
   * @param channel
   */
  async react(emoji: string, ts: string, channel: string) {
    await this.app.client.reactions.add({
      token: this.config.token,
      name: emoji,
      channel,
      timestamp: ts,
    })
  }
}
