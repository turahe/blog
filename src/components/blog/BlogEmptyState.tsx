import Link from '@/components/Link'

export function BlogEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-900/40">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>
      <Link
        href="/blog"
        className="text-primary-600 dark:text-primary-400 mt-6 inline-flex text-sm font-medium"
      >
        Browse all articles →
      </Link>
    </div>
  )
}
