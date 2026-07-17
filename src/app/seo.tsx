import type { Metadata } from 'next'
import { getSiteMetadata } from '@/lib/site-metadata/get-site-metadata'

interface PageSEOProps {
  title: string
  description?: string
  image?: string
  [key: string]: any
}

export async function genPageMetadata({
  title,
  description,
  image,
  ...rest
}: PageSEOProps): Promise<Metadata> {
  const siteMetadata = await getSiteMetadata()

  return {
    title,
    openGraph: {
      title: `${title} | ${siteMetadata.title}`,
      description: description || siteMetadata.description,
      url: './',
      siteName: siteMetadata.title,
      images: image ? [image] : [siteMetadata.socialBanner],
      locale: siteMetadata.locale.replace('-', '_'),
      type: 'website',
    },
    twitter: {
      title: `${title} | ${siteMetadata.title}`,
      card: 'summary_large_image',
      images: image ? [image] : [siteMetadata.socialBanner],
    },
    ...rest,
  }
}
