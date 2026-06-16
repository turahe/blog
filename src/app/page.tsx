import { getAllPosts, sortPosts } from '@/services'
import Main from './Main'

export const revalidate = 60

export default async function Page() {
  const sortedPosts = sortPosts(await getAllPosts())
  return <Main posts={sortedPosts} />
}
