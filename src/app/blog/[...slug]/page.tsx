import 'css/prism.css'
import 'katex/dist/katex.css'

import { components } from '@/components/MDXComponents'
import { MdxContent } from '@/components/MdxContent'
import { sortPosts, getAllPosts, getPostBySlug, getPostAuthors, getRelatedPosts } from '@/services'
import type { PostCore } from '@/types/post'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import SocialShare from '@/components/SocialShare'
import { RelatedPosts } from '@/components/blog/RelatedPosts'
import { BreadcrumbJsonLd } from '@/components/blog/BreadcrumbJsonLd'
import { Metadata } from 'next'
import { getSiteMetadata } from '@/lib/site-metadata/get-site-metadata'
import { notFound } from 'next/navigation'
import { getPostFeaturedImage } from '@/lib/blog/post-images'

const defaultLayout = 'PostLayout' as const
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
} as const

type LayoutName = keyof typeof layouts

export const revalidate = 60

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const post = await getPostBySlug(slug)
  if (!post) return

  const siteMetadata = await getSiteMetadata()
  const authorDetails = await getPostAuthors(slug)
  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()
  const authors = authorDetails.map((author) => author.name)
  const canonical = post.canonicalUrl ?? `${siteMetadata.siteUrl}/blog/${post.slug}`

  let imageList = [siteMetadata.socialBanner]
  if (post.images) {
    imageList = typeof post.images === 'string' ? [post.images] : post.images
  }
  const ogImages = imageList.map((img) => ({
    url: img.includes('http') ? img : siteMetadata.siteUrl + img,
  }))

  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: siteMetadata.locale?.replace('-', '_') ?? 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: canonical,
      images: ogImages,
      authors: authors.length > 0 ? authors : [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: imageList,
    },
    other: {
      'article:reading_time': String(post.readingTime.minutes),
    },
  }
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const sortedPosts = sortPosts(await getAllPosts())
  const postIndex = sortedPosts.findIndex((p) => p.slug === slug)
  if (postIndex === -1) {
    return notFound()
  }

  const prev = sortedPosts[postIndex + 1] as PostCore | undefined
  const next = sortedPosts[postIndex - 1] as PostCore | undefined
  const post = await getPostBySlug(slug)
  if (!post) return notFound()

  const siteMetadata = await getSiteMetadata()
  const [authorDetails, relatedPosts] = await Promise.all([
    getPostAuthors(slug),
    getRelatedPosts(slug),
  ])

  const shareUrl = `${siteMetadata.siteUrl}/blog/${post.slug}`
  const featuredImage = getPostFeaturedImage(post.images)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.lastmod || post.date,
    description: post.summary,
    image: featuredImage
      ? featuredImage.includes('http')
        ? featuredImage
        : `${siteMetadata.siteUrl}${featuredImage}`
      : siteMetadata.socialBanner,
    url: post.canonicalUrl ?? shareUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': post.canonicalUrl ?? shareUrl },
    author: authorDetails.map((author) => ({
      '@type': 'Person',
      name: author.name,
      url: `${siteMetadata.siteUrl}/author/${author.slug}`,
    })),
    articleSection: post.category,
    keywords: post.tags?.join(', '),
    wordCount: post.wordCount,
    timeRequired: `PT${post.readingTime.minutes}M`,
    publisher: {
      '@type': 'Organization',
      name: siteMetadata.title,
    },
  }

  const layoutName = (post.layout || defaultLayout) as LayoutName
  const Layout = layouts[layoutName] ?? PostLayout

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { label: 'Blog', href: '/blog' },
          ...(post.category && post.categorySlug
            ? [{ label: post.category, href: `/category/${post.categorySlug}` }]
            : []),
          { label: post.title },
        ]}
      />
      <Layout
        content={post}
        authorDetails={authorDetails}
        next={next}
        prev={prev}
        musicFile={post.music}
        shareUrl={shareUrl}
      >
        <MdxContent source={post.body} components={components} />
        <SocialShare
          url={shareUrl}
          title={post.title}
          description={post.summary}
          hashtags={post.tags || []}
        />
        <RelatedPosts posts={relatedPosts} />
      </Layout>
    </>
  )
}
