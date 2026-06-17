import Link from 'next/link'
import { getSiteMetadata } from '@/lib/site-metadata/get-site-metadata'

interface AuthHeaderProps {
  title: string
  description?: string
  showMobileLogo?: boolean
}

export async function AuthHeader({ title, description, showMobileLogo = true }: AuthHeaderProps) {
  const siteMetadata = await getSiteMetadata()
  return (
    <header className="mb-8 space-y-3 text-center lg:text-left">
      {showMobileLogo && (
        <Link
          href="/"
          className="mb-2 inline-flex items-center justify-center gap-2 lg:hidden"
          aria-label={`${siteMetadata.headerTitle} home`}
        >
          <span className="bg-primary-600 flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white">
            W
          </span>
          <span className="text-base font-semibold text-gray-900 dark:text-white">
            {siteMetadata.headerTitle}
          </span>
        </Link>
      )}
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h1>
        {description && (
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{description}</p>
        )}
      </div>
    </header>
  )
}
