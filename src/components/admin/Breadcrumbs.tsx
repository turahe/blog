import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const current = items[items.length - 1]

  return (
    <nav className="mb-6">
      <ol className="flex items-center gap-1.5">
        <li>
          <Link
            href="/admin"
            className="text-theme-sm inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400"
          >
            Home
            <ChevronIcon />
          </Link>
        </li>
        {items.slice(0, -1).map((item) => (
          <li key={item.label}>
            <Link
              href={item.href ?? '#'}
              className="text-theme-sm inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400"
            >
              {item.label}
              <ChevronIcon />
            </Link>
          </li>
        ))}
        {current && (
          <li className="text-theme-sm text-gray-800 dark:text-white/90">{current.label}</li>
        )}
      </ol>
    </nav>
  )
}

function ChevronIcon() {
  return (
    <svg
      className="stroke-current"
      width="17"
      height="16"
      viewBox="0 0 17 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
