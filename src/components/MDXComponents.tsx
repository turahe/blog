import TOCInline from '@/components/ui/TOCInline'
import Pre from '@/components/ui/Pre'
import NewsletterForm from '@/components/ui/NewsletterForm'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  BlogNewsletterForm: NewsletterForm,
}
