import Link from '@/components/Link'
import Image from '@/components/Image'
import { formatDate } from '@/lib/formatDate'
import { getPostFeaturedImage } from '@/lib/blog/post-images'
import { getSiteMetadata } from '@/lib/site-metadata/get-site-metadata'
import type { PostCore } from '@/types/post'
import { CategoryPill } from '@/components/blog/CategoryPill'

interface FeaturedPostProps {
  post: PostCore
}

export async function FeaturedPost({ post }: FeaturedPostProps) {
  const siteMetadata = await getSiteMetadata()
  const image = getPostFeaturedImage(post.images)
  const href = `/blog/${post.slug}`

  return (
    <section className="mb-12">
      <article className="group grid overflow-hidden rounded-2xl border border-gray-200 bg-white md:grid-cols-2 dark:border-gray-800 dark:bg-gray-950">
        <Link
          href={href}
          className="relative block aspect-[16/10] min-h-[220px] bg-gray-100 md:aspect-auto md:min-h-[320px] dark:bg-gray-900"
        >
          {image ? (
            <Image
              src={image}
              alt={post.title}
              fill
              priority
              className="object-cover transition duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full min-h-[220px] items-center justify-center text-gray-400">
              Featured
            </div>
          )}
        </Link>
        <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
          <p className="text-primary-600 dark:text-primary-400 text-xs font-semibold tracking-wider uppercase">
            Featured
          </p>
          <h2 className="text-2xl leading-tight font-bold text-gray-900 md:text-4xl dark:text-gray-100">
            <Link href={href} className="hover:text-primary-600 dark:hover:text-primary-400">
              {post.title}
            </Link>
          </h2>
          {post.summary && (
            <p className="line-clamp-3 text-base leading-relaxed text-gray-600 dark:text-gray-400">
              {post.summary}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <time dateTime={post.date}>{formatDate(post.date, siteMetadata.locale)}</time>
            {post.readingTime && <span>· {post.readingTime.minutes} min read</span>}
            {post.category && post.categorySlug && (
              <CategoryPill name={post.category} slug={post.categorySlug} />
            )}
          </div>
          <Link
            href={href}
            className="text-primary-600 dark:text-primary-400 text-sm font-semibold"
          >
            Read article →
          </Link>
        </div>
      </article>
    </section>
  )
}
