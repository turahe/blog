import Link from '@/components/Link'
import Image from '@/components/Image'
import type { AuthorCore } from '@/types/post'

interface AuthorBylineProps {
  name: string
  slug: string
}

export function AuthorByline({ name, slug }: AuthorBylineProps) {
  return (
    <Link
      href={`/author/${slug}`}
      className="hover:text-primary-600 dark:hover:text-primary-400 font-medium text-gray-700 dark:text-gray-300"
    >
      {name}
    </Link>
  )
}

interface AuthorCardProps {
  author: AuthorCore
  postCount?: number
}

export function AuthorCard({ author, postCount }: AuthorCardProps) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
      {author.avatar && (
        <Image
          src={author.avatar}
          alt={author.name}
          width={64}
          height={64}
          className="h-16 w-16 rounded-full object-cover"
        />
      )}
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{author.name}</h1>
        {(author.occupation || author.company) && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {[author.occupation, author.company].filter(Boolean).join(' · ')}
          </p>
        )}
        {postCount !== undefined && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{postCount} articles</p>
        )}
      </div>
    </div>
  )
}
