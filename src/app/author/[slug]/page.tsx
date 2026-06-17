import ListLayout from '@/layouts/ListLayoutWithTagsWrapper'
import { getPostsByAuthor, getAuthorBySlug } from '@/services'
import { AuthorCard } from '@/components/blog/AuthorCard'
import { genPageMetadata } from '@/app/seo'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

const POSTS_PER_PAGE = 5

export const revalidate = 60

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await props.params
  const author = await getAuthorBySlug(decodeURI(slug))
  if (!author) return genPageMetadata({ title: 'Author' })

  return genPageMetadata({
    title: author.name,
    description: author.body || `Articles by ${author.name}`,
    alternates: { canonical: `/author/${author.slug}` },
  })
}

export default async function AuthorPage(props: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await props.params
  const slug = decodeURI(rawSlug)
  const author = await getAuthorBySlug(slug)
  if (!author) notFound()

  const posts = await getPostsByAuthor(slug)
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE)

  return (
    <div className="space-y-8">
      <AuthorCard author={author} postCount={posts.length} />
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={{ currentPage: 1, totalPages }}
        title={`Articles by ${author.name}`}
        basePath={`/author/${slug}`}
      />
    </div>
  )
}
