import Link from 'next/link'

interface BlogPaginationProps {
  basePath: string
  currentPage: number
  totalPages: number
}

export function BlogPagination({ basePath, currentPage, totalPages }: BlogPaginationProps) {
  if (totalPages <= 1) return null

  const prevHref = currentPage <= 2 ? basePath : `${basePath}/page/${currentPage - 1}`
  const nextHref = `${basePath}/page/${currentPage + 1}`

  return (
    <nav
      className="mt-10 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-800"
      aria-label="Pagination"
    >
      {currentPage > 1 ? (
        <Link
          href={prevHref}
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-medium"
        >
          ← Previous
        </Link>
      ) : (
        <span className="text-sm text-gray-400">← Previous</span>
      )}
      <span className="text-sm text-gray-500 dark:text-gray-400">
        Page {currentPage} of {totalPages}
      </span>
      {currentPage < totalPages ? (
        <Link
          href={nextHref}
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-medium"
        >
          Next →
        </Link>
      ) : (
        <span className="text-sm text-gray-400">Next →</span>
      )}
    </nav>
  )
}
