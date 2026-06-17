import Link from '@/components/Link'

interface CategoryPillProps {
  name: string
  slug: string
  count?: number
}

export function CategoryPill({ name, slug, count }: CategoryPillProps) {
  return (
    <Link
      href={`/category/${slug}`}
      className="hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-primary-950 dark:hover:text-primary-300 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 transition dark:bg-gray-800 dark:text-gray-300"
    >
      {name}
      {count !== undefined && <span className="ml-1 opacity-70">({count})</span>}
    </Link>
  )
}
