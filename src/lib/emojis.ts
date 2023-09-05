import { sampleSize, random, uniq } from 'lodash'

export interface ClassEmoji {
  required: string[]
  random?: string[]
}

export const classEmojiMaps: { [key: string]: ClassEmoji } = {
  dog: {
    required: ['dog', 'dog2', 'heart'],
  },
  cat: {
    required: ['cat', 'cat2', 'heart'],
  },
  laptop: {
    required: ['computer'],
  },
  'cell phone': {
    required: ['iphone'],
  },
  'hot dog': {
    required: ['hotdog'],
  },
  'wine glass': {
    required: ['wine_glass'],
  },
  cup: {
    required: ['coffee'],
  },
  'potted plant': {
    required: ['seedling'],
  },
}

export const classToEmojis = ($class: string): string[] => {
  const emoji = classEmojiMaps[$class] || { required: [$class], random: [] }
  if (!emoji.random || emoji.random.length === 0) return emoji.required

  const sampleLength = random(emoji.random.length - 1)
  const randomEmojis = sampleSize(emoji.random, sampleLength)
  return [...emoji.required, ...randomEmojis]
}

interface KeywordEmoji {
  pattern: RegExp
  emojis: string[]
  random?: string[]
  randomCount?: number
  probability?: number
}

export const keywordEmojis: KeywordEmoji[] = [
  {
    pattern: /(哈哈哈).*/i,
    emojis: ['joy'],
    random: ['laughing'],
    probability: 0.6,
  },
  {
    pattern: /(nextjs|next\.js).*/i,
    emojis: ['nextjs'],
    random: ['vercel', 'clown_face'],
  },
  {
    pattern: /(vercel|zeit).*/i,
    emojis: ['vercel'],
  },
  {
    pattern: /(react|reactjs|react\.js).*/i,
    emojis: ['react'],
  },
  {
    pattern: /(vue|vuejs|vue\.js).*/i,
    emojis: ['vue'],
  },
]

export const keywordToEmojis = (input: string): string[] => {
  let emojis: string[] = []

  for (const {
    pattern,
    emojis: e,
    random,
    randomCount,
    probability = 1,
  } of keywordEmojis) {
    if (pattern.test(input)) {
      const seed = Math.random()
      if (probability < 1 && seed < 1 - probability) continue

      emojis = [...emojis, ...e]

      if (random && random.length > 0) {
        emojis = [...emojis, ...sampleSize(random, randomCount || 1)]
      }
    }
  }

  return uniq(emojis)
}

const regex = /(:(?![\n])[()#$@+\-\w]+:)/g

export function filterEmojiSkinTone(emoji: string) {
  // filter skin-tones
  for (let i = 1; i <= 6; ++i) {
    emoji = emoji.replace('::skin-tone-' + i, '')
  }

  return emoji
}

export function parseEmojis(text: string) {
  let m: RegExpExecArray | null
  const foundEmojis: string[] = []

  while ((m = regex.exec(text)) !== null) {
    // to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++
    }

    m.forEach((match: string) => {
      // strip out first ':' and last ':'
      const emoji = filterEmojiSkinTone(match.substring(1, match.length - 1))
      if (!foundEmojis.includes(emoji) && emoji.indexOf('skin-tone-') !== 0) {
        foundEmojis.push(emoji)
      }
    })
  }

  return foundEmojis
}
