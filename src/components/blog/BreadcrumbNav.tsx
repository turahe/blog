import Link from '@/components/Link'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export function BreadcrumbNav({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500 dark:text-gray-400">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400">
            Home
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
            <span aria-hidden>/</span>
            {item.href ? (
              <Link href={item.href} className="hover:text-primary-600 dark:hover:text-primary-400">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-800 dark:text-gray-200">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
