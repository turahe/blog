export function SettingsSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-48 rounded-lg bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-72 rounded bg-gray-200 dark:bg-gray-800" />
        </div>
        <div className="h-9 w-28 rounded-lg bg-gray-200 dark:bg-gray-800" />
      </div>
      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-gray-200 dark:bg-gray-800" />
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-64 rounded-2xl bg-gray-200 dark:bg-gray-800" />
          <div className="h-48 rounded-2xl bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </div>
  )
}
