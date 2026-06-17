import Link from '@/components/Link'
import { FeaturedPost } from '@/components/blog/FeaturedPost'
import { ArticleCard } from '@/components/blog/ArticleCard'
import { CategoryPill } from '@/components/blog/CategoryPill'
import { NewsletterCard } from '@/components/blog/NewsletterCard'
import { getSiteMetadata } from '@/lib/site-metadata/get-site-metadata'
import { getPostFeaturedImage } from '@/lib/blog/post-images'
import type { PostCore, CategoryItem } from '@/types/post'

const LATEST_COUNT = 6

interface HomeProps {
  posts: PostCore[]
  categories: CategoryItem[]
}

export default async function Main({ posts, categories }: HomeProps) {
  const siteMetadata = await getSiteMetadata()
  const featured = posts.find((p) => getPostFeaturedImage(p.images)) ?? posts[0]
  const featuredSlugs = new Set(featured ? [featured.slug] : [])
  const latest = posts.filter((p) => !featuredSlugs.has(p.slug)).slice(0, LATEST_COUNT)
  const trending = posts.slice(0, 4)

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-800">
      <section className="pt-2 pb-10">
        <p className="text-primary-600 dark:text-primary-400 text-sm font-semibold tracking-wider uppercase">
          Editorial
        </p>
        <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl dark:text-gray-100">
          Thoughts on software, craft, and building things that last.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          {siteMetadata.description}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/blog"
            className="bg-primary-600 hover:bg-primary-700 inline-flex rounded-lg px-4 py-2.5 text-sm font-medium text-white"
          >
            Read the blog
          </Link>
          <Link
            href="/search"
            className="inline-flex rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900"
          >
            Search articles
          </Link>
        </div>
      </section>

      {featured && (
        <section className="py-10">
          <FeaturedPost post={featured} />
        </section>
      )}

      {trending.length > 1 && (
        <section className="py-10">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Trending</h2>
            <Link
              href="/blog"
              className="text-primary-600 dark:text-primary-400 text-sm font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {trending.slice(0, 2).map((post) => (
              <ArticleCard key={post.slug} post={post} featured />
            ))}
          </div>
        </section>
      )}

      <section className="py-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Latest articles</h2>
          <Link href="/blog" className="text-primary-600 dark:text-primary-400 text-sm font-medium">
            All posts →
          </Link>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {latest.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {categories.length > 0 && (
        <section className="py-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Browse by category
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((c) => (
              <CategoryPill key={c.slug} name={c.name} slug={c.slug} count={c.postCount} />
            ))}
          </div>
        </section>
      )}

      {siteMetadata.newsletter?.provider && (
        <section className="py-10">
          <NewsletterCard />
        </section>
      )}
    </div>
  )
}
