import { searchPosts } from '@/services'
import { ArticleCard } from '@/components/blog/ArticleCard'
import { BlogEmptyState } from '@/components/blog/BlogEmptyState'
import { genPageMetadata } from '@/app/seo'
import type { Metadata } from 'next'

export const revalidate = 60

export async function generateMetadata(props: {
  searchParams: Promise<{ q?: string }>
}): Promise<Metadata> {
  const { q } = await props.searchParams
  return genPageMetadata({
    title: q ? `Search: ${q}` : 'Search',
    description: 'Search articles on the blog',
    robots: { index: false, follow: true },
  })
}

export default async function SearchPage(props: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await props.searchParams
  const query = q.trim()
  const results = query ? await searchPosts(query) : []

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Search</h1>
        <form action="/search" method="get" className="mt-4 flex max-w-xl gap-2">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search articles…"
            className="focus:border-primary-500 focus:ring-primary-500/20 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
          />
          <button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium text-white"
          >
            Search
          </button>
        </form>
      </header>

      {query && results.length === 0 && (
        <BlogEmptyState
          title={`No results for “${query}”`}
          description="Try different keywords or browse all articles."
        />
      )}

      {results.length > 0 && (
        <div>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            {results.length} result{results.length === 1 ? '' : 's'} for “{query}”
          </p>
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {results.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
