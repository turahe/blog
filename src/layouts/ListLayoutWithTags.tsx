import { BlogLayout } from '@/components/blog/BlogLayout'
import { ArticleCard } from '@/components/blog/ArticleCard'
import { BlogSidebar } from '@/components/blog/BlogSidebar'
import { BlogPagination } from '@/components/blog/BlogPagination'
import { BlogEmptyState } from '@/components/blog/BlogEmptyState'
import type { PostCore, PaginationMeta, CategoryItem } from '@/types/post'

interface ListLayoutProps {
  posts: PostCore[]
  title: string
  description?: string
  initialDisplayPosts?: PostCore[]
  pagination?: PaginationMeta
  basePath?: string
  tagCounts: Record<string, number>
  categories: CategoryItem[]
  recentPosts: PostCore[]
  popularPosts: PostCore[]
  activeTag?: string
  activeCategory?: string
}

export default function ListLayoutWithTags({
  posts,
  title,
  description,
  initialDisplayPosts = [],
  pagination,
  basePath = '/blog',
  tagCounts,
  categories,
  recentPosts,
  popularPosts,
  activeTag,
  activeCategory,
}: ListLayoutProps) {
  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <BlogLayout
      title={title}
      description={description}
      sidebar={
        <BlogSidebar
          tagCounts={tagCounts}
          categories={categories}
          recentPosts={recentPosts}
          popularPosts={popularPosts}
          activeTag={activeTag}
          activeCategory={activeCategory}
        />
      }
    >
      {!displayPosts.length ? (
        <BlogEmptyState title="No articles yet" description="Check back soon for new content." />
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {displayPosts.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      )}
      {pagination && pagination.totalPages > 1 && (
        <BlogPagination
          basePath={basePath}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
        />
      )}
    </BlogLayout>
  )
}
