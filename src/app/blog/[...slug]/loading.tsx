export default function PostLoading() {
  return (
    <div className="animate-pulse space-y-6 py-12">
      <div className="h-12 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
      <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-800" />
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
        ))}
      </div>
    </div>
  )
}
