import { getCategoriesWithCounts, getPopularPosts, getRecentPosts, getTagCounts } from '@/services'
import type { PaginationMeta, PostCore } from '@/types/post'
import ListLayoutWithTags from './ListLayoutWithTags'

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
