'use client'

import { XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { formatFileSize } from '@/modules/media/constants'
import type { UploadQueueItem } from '@/modules/media/types'

export function UploadQueue({
  items,
  onRetry,
  onCancel,
  onDismiss,
}: {
  items: UploadQueueItem[]
  onRetry: (id: string) => void
  onCancel: (id: string) => void
  onDismiss: () => void
}) {
  const active = items.filter((i) => i.status !== 'done' && i.status !== 'cancelled')
  if (!items.length) return null

  return (
    <div className="fixed right-4 bottom-4 z-50 w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Upload queue</p>
        <button type="button" onClick={onDismiss} className="text-gray-400 hover:text-gray-600">
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
      <ul className="max-h-64 overflow-y-auto">
        {items.map((item) => (
          <li
            key={item.id}
            className="border-b border-gray-100 px-4 py-3 last:border-0 dark:border-gray-800"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                {item.file.name}
              </p>
              <span className="shrink-0 text-xs text-gray-500">
                {formatFileSize(item.file.size)}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              <div
                className={`h-full transition-all ${
                  item.status === 'error'
                    ? 'bg-error-500'
                    : item.status === 'done'
                      ? 'bg-success-500'
                      : 'bg-brand-500'
                }`}
                style={{ width: `${item.progress}%` }}
              />
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-xs text-gray-500 capitalize">{item.status}</span>
              <div className="flex gap-2">
                {item.status === 'error' && (
                  <button
                    type="button"
                    onClick={() => onRetry(item.id)}
                    className="text-brand-600 text-xs"
                  >
                    <ArrowPathIcon className="h-4 w-4" />
                  </button>
                )}
                {(item.status === 'pending' || item.status === 'uploading') && (
                  <button
                    type="button"
                    onClick={() => onCancel(item.id)}
                    className="text-xs text-gray-500"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
            {item.error && <p className="text-error-600 mt-1 text-xs">{item.error}</p>}
          </li>
        ))}
      </ul>
      {active.length === 0 && items.some((i) => i.status === 'done') && (
        <p className="text-success-600 px-4 py-2 text-xs">All uploads finished</p>
      )}
    </div>
  )
}
