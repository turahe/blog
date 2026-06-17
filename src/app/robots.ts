import { MetadataRoute } from 'next'
import { getSiteMetadata } from '@/lib/site-metadata/get-site-metadata'

export const revalidate = 3600

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteMetadata = await getSiteMetadata()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`,
    host: siteMetadata.siteUrl,
  }
}
