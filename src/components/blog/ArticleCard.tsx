import Link from '@/components/Link'
import Image from '@/components/Image'
import { formatDate } from '@/lib/formatDate'
import { getPostFeaturedImage } from '@/lib/blog/post-images'
import { getSiteMetadata } from '@/lib/site-metadata/get-site-metadata'
import type { PostCore } from '@/types/post'
import { CategoryPill } from '@/components/blog/CategoryPill'
import { AuthorByline } from '@/components/blog/AuthorCard'

interface ArticleCardProps {
  post: PostCore
  featured?: boolean
  /** Eager-load hero image for LCP (use on at most one card per page). */
  priority?: boolean
}

export async function ArticleCard({ post, featured = false, priority = false }: ArticleCardProps) {
  const siteMetadata = await getSiteMetadata()
  const image = getPostFeaturedImage(post.images)
  const href = `/blog/${post.slug}`

  if (featured) {
    return (
      <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:border-gray-300 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-700">
        {image ? (
          <Link
            href={href}
            className="relative block aspect-[16/9] w-full overflow-hidden bg-gray-100 dark:bg-gray-900"
          >
            <Image
              src={image}
              alt={post.title}
              fill
              priority={priority}
              className="object-cover transition duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 66vw"
            />
          </Link>
        ) : (
          <div className="relative aspect-[16/9] w-full bg-gray-100 dark:bg-gray-900">
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              No image
            </div>
          </div>
        )}
        <div className="space-y-3 p-6 md:p-8">
          <ArticleMeta post={post} locale={siteMetadata.locale} />
          <h2 className="text-2xl leading-snug font-bold text-gray-900 md:text-3xl dark:text-gray-100">
            <Link href={href} className="hover:text-primary-600 dark:hover:text-primary-400">
              {post.title}
            </Link>
          </h2>
          {post.summary && (
            <p className="line-clamp-3 text-base leading-relaxed text-gray-600 dark:text-gray-400">
              {post.summary}
            </p>
          )}
          <Link
            href={href}
            className="text-primary-600 dark:text-primary-400 inline-flex text-sm font-medium"
          >
            Read article →
          </Link>
        </div>
      </article>
    )
  }

  return (
    <article className="group border-b border-gray-200 py-8 last:border-b-0 dark:border-gray-800">
      <div className="flex flex-col gap-5 sm:flex-row">
        {image && (
          <Link
            href={href}
            className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:w-48 md:w-56 dark:bg-gray-900"
          >
            <Image
              src={image}
              alt={post.title}
              fill
              priority={priority}
              className="object-cover transition duration-300 group-hover:scale-[1.02]"
              sizes={
                priority ? '(max-width: 640px) 100vw, 560px' : '(max-width: 640px) 100vw, 224px'
              }
            />
          </Link>
        )}
        <div className="min-w-0 flex-1 space-y-2">
          <ArticleMeta post={post} locale={siteMetadata.locale} />
          <h2 className="text-xl leading-snug font-bold text-gray-900 dark:text-gray-100">
            <Link href={href} className="hover:text-primary-600 dark:hover:text-primary-400">
              {post.title}
            </Link>
          </h2>
          {post.summary && (
            <p className="line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {post.summary}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}

function ArticleMeta({ post, locale }: { post: PostCore; locale: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
      <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
      {post.readingTime && (
        <>
          <span aria-hidden>·</span>
          <span>{post.readingTime.minutes} min read</span>
        </>
      )}
      {post.category && post.categorySlug && (
        <>
          <span aria-hidden>·</span>
          <CategoryPill name={post.category} slug={post.categorySlug} />
        </>
      )}
      {post.authorName && post.authorSlug && (
        <>
          <span aria-hidden>·</span>
          <AuthorByline name={post.authorName} slug={post.authorSlug} />
        </>
      )}
    </div>
  )
}
