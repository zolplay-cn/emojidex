import { registerAs } from '@nestjs/config'

export default registerAs('slack', () => ({
  token: process.env.SLACK_BOT_TOKEN || '',
  appToken: process.env.SLACK_APP_TOKEN || '',
  signingSecret: process.env.SLACK_SIGNING_SECRET || '',
}))
