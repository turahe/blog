import { getTagCounts } from '@/services'
import ListLayoutWithTags from './ListLayoutWithTags'
import type { PostCore, PaginationMeta } from '@/types/post'

interface ListLayoutWithTagsWrapperProps {
  posts: PostCore[]
  title: string
  initialDisplayPosts?: PostCore[]
  pagination?: PaginationMeta
}

export default async function ListLayoutWithTagsWrapper(props: ListLayoutWithTagsWrapperProps) {
  const tagCounts = await getTagCounts()
  return <ListLayoutWithTags {...props} tagCounts={tagCounts} />
}
