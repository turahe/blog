import Link from '@/components/Link'
import Tag from '@/components/Tag'
import type { PostCore, CategoryItem } from '@/types/post'
import { formatDate } from '@/lib/formatDate'
import { getSiteMetadata } from '@/lib/site-metadata/get-site-metadata'

interface BlogSidebarProps {
  tagCounts: Record<string, number>
  categories: CategoryItem[]
  recentPosts: PostCore[]
  popularPosts: PostCore[]
  activeTag?: string
  activeCategory?: string
}

export async function BlogSidebar({
  tagCounts,
  categories,
  recentPosts,
  popularPosts,
  activeTag: _activeTag,
  activeCategory,
}: BlogSidebarProps) {
  void _activeTag
  const siteMetadata = await getSiteMetadata()
  const sortedTags = Object.keys(tagCounts)
    .sort((a, b) => tagCounts[b] - tagCounts[a])
    .slice(0, 12)

  return (
    <div className="space-y-8">
      <Widget title="Search">
        <form action="/search" method="get" className="flex gap-2">
          <input
            type="search"
            name="q"
            placeholder="Search articles…"
            className="focus:border-primary-500 focus:ring-primary-500/20 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
          />
          <button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-white"
          >
            Go
          </button>
        </form>
      </Widget>

      <Widget title="Categories">
        <ul className="space-y-2">
          <li>
            <Link
              href="/blog"
              className={`text-sm ${!activeCategory ? 'text-primary-600 dark:text-primary-400 font-semibold' : 'hover:text-primary-600 text-gray-600 dark:text-gray-400'}`}
            >
              All posts
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/category/${c.slug}`}
                className={`text-sm ${activeCategory === c.slug ? 'text-primary-600 dark:text-primary-400 font-semibold' : 'hover:text-primary-600 text-gray-600 dark:text-gray-400'}`}
              >
                {c.name} ({c.postCount})
              </Link>
            </li>
          ))}
        </ul>
      </Widget>

      <Widget title="Recent">
        <ul className="space-y-3">
          {recentPosts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium text-gray-800 dark:text-gray-200"
              >
                {post.title}
              </Link>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(post.date, siteMetadata.locale)}
              </p>
            </li>
          ))}
        </ul>
      </Widget>

      <Widget title="Popular">
        <ul className="space-y-3">
          {popularPosts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium text-gray-800 dark:text-gray-200"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </Widget>

      <Widget title="Tags">
        <div className="flex flex-wrap gap-2">
          {sortedTags.map((tag) => (
            <Tag key={tag} text={tag} />
          ))}
        </div>
        <Link
          href="/tags"
          className="text-primary-600 dark:text-primary-400 mt-3 inline-block text-sm"
        >
          View all tags →
        </Link>
      </Widget>
    </div>
  )
}

function Widget({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900/50">
      <h2 className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  )
}
