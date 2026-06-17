import readingTime from 'reading-time'
import { extractToc } from '@/lib/mdx/toc'
import type { Prisma } from '@/lib/db/prisma'

export function computeWordCount(text: string): number {
  const cleaned = text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#*_~`]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
  return cleaned.split(/\s+/).filter((word) => word.length > 0).length
}

export async function computePostMeta(body: string) {
  const rt = readingTime(body)
  const toc = await extractToc(body)
  return {
    readingTimeMinutes: rt.minutes,
    wordCount: computeWordCount(body),
    toc: toc as unknown as Prisma.InputJsonValue,
  }
}
