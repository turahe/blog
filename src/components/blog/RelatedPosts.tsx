import { ArticleCard } from '@/components/blog/ArticleCard'
import type { PostCore } from '@/types/post'

interface RelatedPostsProps {
  posts: PostCore[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts.length) return null

  return (
    <section className="mt-12 border-t border-gray-200 pt-10 dark:border-gray-800">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">You might also like</h2>
      <div className="mt-6 divide-y divide-gray-200 dark:divide-gray-800">
        {posts.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  )
}
