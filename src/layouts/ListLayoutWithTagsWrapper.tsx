import { getTagCounts, getCategoriesWithCounts, getRecentPosts, getPopularPosts } from '@/services'
import ListLayoutWithTags from './ListLayoutWithTags'
import type { PostCore, PaginationMeta } from '@/types/post'

interface ListLayoutWithTagsWrapperProps {
  posts: PostCore[]
  title: string
  description?: string
  initialDisplayPosts?: PostCore[]
  pagination?: PaginationMeta
  basePath?: string
  activeTag?: string
  activeCategory?: string
}

export default async function ListLayoutWithTagsWrapper(props: ListLayoutWithTagsWrapperProps) {
  const [tagCounts, categories, recentPosts, popularPosts] = await Promise.all([
    getTagCounts(),
    getCategoriesWithCounts(),
    getRecentPosts(5),
    getPopularPosts(5),
  ])

  return (
    <ListLayoutWithTags
      {...props}
      tagCounts={tagCounts}
      categories={categories}
      recentPosts={recentPosts}
      popularPosts={popularPosts}
    />
  )
}
