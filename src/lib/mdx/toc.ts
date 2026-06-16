import { extractTocHeadings } from 'pliny/mdx-plugins/index.js'
import type { TocHeading } from '@/types/post'

export async function extractToc(rawMdx: string): Promise<TocHeading[]> {
  const toc = await extractTocHeadings(rawMdx)
  return toc as unknown as TocHeading[]
}
