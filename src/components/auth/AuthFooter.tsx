import Link from 'next/link'
import packageJson from '../../../package.json'

interface AuthFooterProps {
  helpHref?: string
  helpLabel?: string
  showVersion?: boolean
}

export function AuthFooter({
  helpHref = '/about',
  helpLabel = 'Need help?',
  showVersion = true,
}: AuthFooterProps) {
  return (
    <footer className="mt-8 border-t border-gray-200/80 pt-6 text-center dark:border-gray-800/80">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        <Link
          href={helpHref}
          className="hover:text-primary-600 dark:hover:text-primary-400 font-medium text-gray-700 underline-offset-4 transition-colors hover:underline dark:text-gray-300"
        >
          {helpLabel}
        </Link>
      </p>
      {showVersion && (
        <p
          className="mt-2 text-xs text-gray-400 dark:text-gray-500"
          aria-label="Application version"
        >
          v{packageJson.version}
        </p>
      )}
    </footer>
  )
}
