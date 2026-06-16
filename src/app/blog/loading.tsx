export default function BlogLoading() {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <div className="h-10 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
      </div>
      <div className="space-y-8 py-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-16 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        ))}
      </div>
    </div>
  )
}
