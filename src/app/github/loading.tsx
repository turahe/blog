export default function GitHubLoading() {
  return (
    <div className="container py-12">
      <div className="-m-4 flex flex-wrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="md max-w-[544px] p-4 md:w-1/2">
            <div className="h-48 animate-pulse rounded-md border-2 border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800" />
          </div>
        ))}
      </div>
    </div>
  )
}
