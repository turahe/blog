export function AuthFormSkeleton() {
  return (
    <div className="animate-pulse space-y-5" aria-hidden>
      <div className="space-y-2">
        <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-11 w-full rounded-xl bg-gray-200 dark:bg-gray-800" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-11 w-full rounded-xl bg-gray-200 dark:bg-gray-800" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800" />
      </div>
      <div className="h-11 w-full rounded-xl bg-gray-200 dark:bg-gray-800" />
    </div>
  )
}
