import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeKatexNoTranslate from 'rehype-katex-notranslate'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { remarkAlert } from 'remark-github-blockquote-alert'
import remarkMath from 'remark-math'

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
  } as any
}
