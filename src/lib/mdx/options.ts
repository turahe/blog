import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { remarkAlert } from 'remark-github-blockquote-alert'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeKatexNoTranslate from 'rehype-katex-notranslate'
import rehypePrismPlus from 'rehype-prism-plus'

export function getMdxOptions() {
  return {
    remarkPlugins: [remarkGfm, remarkMath, remarkAlert],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      rehypeKatex,
      rehypeKatexNoTranslate,
      [rehypePrismPlus, { defaultLanguage: 'js', ignoreMissing: true }],
    ],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any
}
