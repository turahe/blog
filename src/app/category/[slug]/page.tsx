import ListLayout from '@/layouts/ListLayoutWithTagsWrapper'
import { getPostsByCategory, getCategoryBySlug } from '@/services'
import { genPageMetadata } from '@/app/seo'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

const POSTS_PER_PAGE = 5

export const revalidate = 60

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await props.params
  const category = await getCategoryBySlug(decodeURI(slug))
  if (!category) return genPageMetadata({ title: 'Category' })

  return genPageMetadata({
    title: category.name,
    description: category.description ?? `Articles in ${category.name}`,
    alternates: { canonical: `/category/${category.slug}` },
  })
}

export default async function CategoryPage(props: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await props.params
  const slug = decodeURI(rawSlug)
  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const posts = await getPostsByCategory(slug)
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE)

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={{ currentPage: 1, totalPages }}
      title={category.name}
      description={category.description ?? undefined}
      basePath={`/category/${slug}`}
      activeCategory={slug}
    />
  )
}
