import 'css/prism.css'
import 'katex/dist/katex.css'

import { components } from '@/components/MDXComponents'
import { MdxContent } from '@/components/MdxContent'
import { sortPosts, getAllPosts, getPostBySlug, getAuthorBySlug } from '@/services'
import type { AuthorCore, PostCore } from '@/types/post'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import SocialShare from '@/components/SocialShare'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { notFound } from 'next/navigation'

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

  const authorList = post.tags ? ['default'] : ['default']
  const authorDetails: AuthorCore[] = []
  for (const authorSlug of authorList) {
    const author = await getAuthorBySlug(authorSlug)
    if (author) authorDetails.push(author)
  }

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()
  const authors = authorDetails.map((author) => author.name)
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
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: './',
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

  const authorDetails: AuthorCore[] = []
  const defaultAuthor = await getAuthorBySlug('default')
  if (defaultAuthor) authorDetails.push(defaultAuthor)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.lastmod || post.date,
    description: post.summary,
    image: post.images
      ? Array.isArray(post.images)
        ? post.images[0]
        : post.images
      : siteMetadata.socialBanner,
    url: `${siteMetadata.siteUrl}/${post.path}`,
    author: authorDetails.map((author) => ({
      '@type': 'Person',
      name: author.name,
    })),
    timeRequired: `PT${post.readingTime.minutes}M`,
  }

  const layoutName = (post.layout || defaultLayout) as LayoutName
  const Layout = layouts[layoutName] ?? PostLayout

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout
        content={post}
        authorDetails={authorDetails}
        next={next}
        prev={prev}
        musicFile={post.music}
      >
        <MdxContent source={post.body} components={components} />
        <SocialShare
          url={`${siteMetadata.siteUrl}/blog/${post.slug}`}
          title={post.title}
          description={post.summary}
          hashtags={post.tags || []}
        />
      </Layout>
    </>
  )
}
