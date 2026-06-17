import ListLayout from '@/layouts/ListLayoutWithTagsWrapper'
import { getPostsByTag } from '@/services'
import { genPageMetadata } from '@/app/seo'
import { getSiteMetadata } from '@/lib/site-metadata/get-site-metadata'
import { Metadata } from 'next'

const POSTS_PER_PAGE = 5

export const revalidate = 60

export async function generateMetadata(props: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const params = await props.params
  const tag = decodeURI(params.tag)
  const siteMetadata = await getSiteMetadata()
  return genPageMetadata({
    title: tag,
    description: `${siteMetadata.title} ${tag} tagged content`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/tags/${tag}/feed.xml`,
      },
    },
  })
}

export default async function TagPage(props: { params: Promise<{ tag: string }> }) {
  const params = await props.params
  const tag = decodeURI(params.tag)
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)
  const filteredPosts = await getPostsByTag(tag)
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = filteredPosts.slice(0, POSTS_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages: totalPages,
  }

  return (
    <ListLayout
      posts={filteredPosts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={title}
      basePath={`/tags/${tag}`}
      activeTag={tag}
    />
  )
}
