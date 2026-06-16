import { getAllPosts, sortPosts } from '@/services'
import { genPageMetadata } from '@/app/seo'
import ListLayout from '@/layouts/ListLayoutWithTagsWrapper'

const POSTS_PER_PAGE = 5

export const metadata = genPageMetadata({ title: 'Blog' })
export const revalidate = 60

export default async function BlogPage() {
  const posts = sortPosts(await getAllPosts())
  const pageNumber = 1
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE * pageNumber)
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
