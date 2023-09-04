import { Injectable } from '@nestjs/common'
import { Stock } from '~/models/stock.model'
import { EmojiUsage } from '~/models/emoji-usage.model'
import { AllTimeEmojiUsage } from '~/models/all-time-emoji-usage.model'
import { MonthlyEmojiUsage } from '~/models/monthly-emoji-usage.model'
import { SecretEmoji } from '~/models/secret-emoji.model'
import dayjs from 'dayjs'

@Injectable()
export class CaptureService {
  constructor() {}

  async capture({
    user,
    emoji,
    channel,
    method,
  }: {
    user: string
    emoji: string
    method: 'REACTION' | 'MESSAGE'
    channel?: string
  }) {
    const stock = await Stock.findOne({
      where: {
        slackId: user,
        emoji,
      },
    })
    await EmojiUsage.create({
      slackId: user,
      emoji,
      method,
      channel: channel || 'none',
      owned: stock !== null,
    })

    // All time emoji
    const allTimeUsage = await AllTimeEmojiUsage.count({
      where: { emoji },
    })
    if (allTimeUsage > 0) {
      await AllTimeEmojiUsage.increment('count', {
        where: { emoji },
      })
    } else {
      await AllTimeEmojiUsage.create({
        emoji,
        count: 1,
      })
    }

    // Monthly usage
    const monthlyWhere = { emoji, month: dayjs().format('YYYY-MM') }
    const monthlyUsage = await MonthlyEmojiUsage.count({
      where: monthlyWhere,
    })
    if (monthlyUsage > 0) {
      await MonthlyEmojiUsage.increment('count', {
        where: monthlyWhere,
      })
    } else {
      await MonthlyEmojiUsage.create({
        ...monthlyWhere,
        count: 1,
      })
    }

    // Secret emojis
    const secretEmoji = await SecretEmoji.findOne({
      where: {
        slackId: user,
        emoji,
      },
    })
    if (!secretEmoji || secretEmoji.bustedBy) return

    const { firstUsedAt } = secretEmoji
    secretEmoji.used++
    if (!firstUsedAt) {
      secretEmoji.firstUsedAt = dayjs().toDate()
    }

    await secretEmoji.save()
  }
}
