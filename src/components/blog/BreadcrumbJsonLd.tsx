import type { BreadcrumbItem } from '@/components/blog/BreadcrumbNav'
import { getSiteMetadata } from '@/lib/site-metadata/get-site-metadata'

export async function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const siteMetadata = await getSiteMetadata()
  const list = [
    { name: 'Home', item: siteMetadata.siteUrl },
    ...items.map((item) => ({
      name: item.label,
      item: item.href ? `${siteMetadata.siteUrl}${item.href}` : undefined,
    })),
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: list.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      ...(entry.item ? { item: entry.item } : {}),
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
