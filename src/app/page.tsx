import { getAllPosts, sortPosts, getCategoriesWithCounts } from '@/services'
import Main from './Main'

export const revalidate = 60

export default async function Page() {
  const [sortedPosts, categories] = await Promise.all([
    sortPosts(await getAllPosts()),
    getCategoriesWithCounts(),
  ])
  return <Main posts={sortedPosts} categories={categories} />
}
