import { ReactNode } from 'react'
import type { PostCore, AuthorCore, TocHeading } from '@/types/post'
import { CommentSection } from '@/components/comments/CommentSection'
import Link from '@/components/Link'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import PlayMusic from '@/components/PlayMusic'
import { getSiteMetadata } from '@/lib/site-metadata/get-site-metadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import { ReadingProgress } from '@/components/blog/ReadingProgress'
import { BreadcrumbNav } from '@/components/blog/BreadcrumbNav'
import { ShareBar } from '@/components/blog/ShareBar'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { AuthorByline } from '@/components/blog/AuthorCard'
import { CategoryPill } from '@/components/blog/CategoryPill'
import { getPostFeaturedImage } from '@/lib/blog/post-images'

const postDateTemplate: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: PostCore & { toc?: TocHeading[] }
  authorDetails: AuthorCore[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
  musicFile?: string
  shareUrl: string
}

export default async function PostLayout({
  content,
  authorDetails,
  next,
  prev,
  children,
  musicFile,
  shareUrl,
}: LayoutProps) {
  const siteMetadata = await getSiteMetadata()
  const {
    path,
    slug,
    date,
    title,
    tags,
    readingTime,
    images,
    category,
    categorySlug,
    toc = [],
  } = content
  const basePath = path.split('/')[0]
  const featuredImage = getPostFeaturedImage(images)

  const breadcrumbs = [
    { label: 'Blog', href: '/blog' },
    ...(category && categorySlug ? [{ label: category, href: `/category/${categorySlug}` }] : []),
    { label: title },
  ]

  return (
    <>
      <ReadingProgress />
      <ScrollTopAndComment />
      <article>
        <BreadcrumbNav items={breadcrumbs} />

        <header className="mx-auto max-w-[760px] pt-4 pb-8">
          <h1 className="text-3xl leading-tight font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl dark:text-gray-100">
            {title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
            <time dateTime={date}>
              {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
            </time>
            {readingTime && (
              <>
                <span aria-hidden>·</span>
                <span>{readingTime.minutes} min read</span>
              </>
            )}
            {category && categorySlug && (
              <>
                <span aria-hidden>·</span>
                <CategoryPill name={category} slug={categorySlug} />
              </>
            )}
          </div>
          {authorDetails.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {authorDetails.map((author) => (
                <div key={author.slug} className="flex items-center gap-2">
                  {author.avatar && (
                    <Image
                      src={author.avatar}
                      width={36}
                      height={36}
                      alt=""
                      className="h-9 w-9 rounded-full"
                    />
                  )}
                  <AuthorByline name={author.name} slug={author.slug} />
                </div>
              ))}
            </div>
          )}
          {featuredImage && (
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-900">
              <Image
                src={featuredImage}
                alt={title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 760px"
              />
            </div>
          )}
        </header>

        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,760px)_200px] lg:justify-center lg:gap-16">
          <div className="min-w-0">
            {musicFile && <PlayMusic musicFile={musicFile} />}
            <div className="prose prose-lg dark:prose-invert max-w-none pb-8">{children}</div>

            {tags && tags.length > 0 && (
              <div className="border-t border-gray-200 py-6 dark:border-gray-800">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Tag key={tag} text={tag} />
                  ))}
                </div>
              </div>
            )}

            <ShareBar url={shareUrl} title={title} />

            {siteMetadata.comments.enabled && (
              <div className="border-t border-gray-200 py-8 dark:border-gray-800" id="comment">
                <CommentSection postSlug={slug} />
              </div>
            )}

            {(next || prev) && (
              <nav className="grid gap-4 border-t border-gray-200 py-8 sm:grid-cols-2 dark:border-gray-800">
                {prev?.path && (
                  <div>
                    <p className="text-xs tracking-wide text-gray-500 uppercase">Previous</p>
                    <Link
                      href={`/${prev.path}`}
                      className="text-primary-600 dark:text-primary-400 mt-1 font-medium"
                    >
                      {prev.title}
                    </Link>
                  </div>
                )}
                {next?.path && (
                  <div className="sm:text-right">
                    <p className="text-xs tracking-wide text-gray-500 uppercase">Next</p>
                    <Link
                      href={`/${next.path}`}
                      className="text-primary-600 dark:text-primary-400 mt-1 font-medium"
                    >
                      {next.title}
                    </Link>
                  </div>
                )}
              </nav>
            )}

            <Link
              href={`/${basePath}`}
              className="text-primary-600 dark:text-primary-400 inline-flex text-sm font-medium"
            >
              ← Back to blog
            </Link>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8">
              <ShareBar url={shareUrl} title={title} vertical />
              <TableOfContents toc={toc} />
            </div>
          </aside>
        </div>
      </article>
    </>
  )
}
