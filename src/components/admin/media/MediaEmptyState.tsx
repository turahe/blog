import { PhotoIcon } from '@heroicons/react/24/outline'

export function MediaEmptyState({ onUpload }: { onUpload?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-900/30">
      <div className="bg-brand-50 text-brand-500 dark:bg-brand-500/10 flex h-16 w-16 items-center justify-center rounded-2xl">
        <PhotoIcon className="h-8 w-8" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white/90">
        No media files yet
      </h3>
      <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
        Upload images, videos, or documents to build your media library.
      </p>
      {onUpload && (
        <button type="button" onClick={onUpload} className="admin-btn-primary mt-6">
          Upload files
        </button>
      )}
    </div>
  )
}

export function MediaSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800"
        >
          <div className="aspect-square bg-gray-200 dark:bg-gray-800" />
          <div className="space-y-2 p-3">
            <div className="h-3 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-2 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      ))}
    </div>
  )
}
