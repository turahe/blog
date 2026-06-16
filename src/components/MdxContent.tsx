import { compileMDX } from 'next-mdx-remote/rsc'
import type { MDXComponents } from 'mdx/types'
import { getMdxOptions } from '@/lib/mdx/options'

interface MdxContentProps {
  source: string
  components?: MDXComponents
}

export async function MdxContent({ source, components }: MdxContentProps) {
  const { content } = await compileMDX({
    source,
    components,
    options: { mdxOptions: getMdxOptions() },
  })
  return content
}
