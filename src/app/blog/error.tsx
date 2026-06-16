'use client'

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Something went wrong</h2>
      <p className="mt-2 text-gray-500 dark:text-gray-400">{error.message}</p>
      <button
        onClick={reset}
        className="bg-primary-500 hover:bg-primary-600 mt-6 rounded px-4 py-2 text-white"
      >
        Try again
      </button>
    </div>
  )
}
