import type { SaveStatus } from '@/modules/settings/types'

interface SaveIndicatorProps {
  status: SaveStatus
  dirty?: boolean
}

export function SaveIndicator({ status, dirty }: SaveIndicatorProps) {
  const label =
    status === 'saving'
      ? 'Saving…'
      : status === 'saved'
        ? 'All changes saved'
        : status === 'error'
          ? 'Save failed'
          : dirty
            ? 'Unsaved changes'
            : 'Up to date'

  const dotClass =
    status === 'saving'
      ? 'bg-warning-400 animate-pulse'
      : status === 'saved'
        ? 'bg-success-500'
        : status === 'error'
          ? 'bg-error-500'
          : dirty
            ? 'bg-warning-400'
            : 'bg-gray-300 dark:bg-gray-600'

  return (
    <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
      <span className={`h-2 w-2 rounded-full ${dotClass}`} />
      {label}
    </div>
  )
}
