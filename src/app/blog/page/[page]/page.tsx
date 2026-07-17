import { notFound } from 'next/navigation'
import ListLayout from '@/layouts/ListLayoutWithTagsWrapper'
import { getAllPosts, sortPosts } from '@/services'

const POSTS_PER_PAGE = 5

export const revalidate = 60

export default async function Page(props: { params: Promise<{ page: string }> }) {
  const params = await props.params
  const posts = sortPosts(await getAllPosts())
  const pageNumber = parseInt(params.page as string, 10)
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)

  if (pageNumber <= 0 || pageNumber > totalPages || Number.isNaN(pageNumber)) {
    return notFound()
  }
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Posts"
    />
  )
}
