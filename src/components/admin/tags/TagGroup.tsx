'use client'

import { memo, useCallback, useId, useMemo, useState } from 'react'
import { AdminTag } from './AdminTag'
import type { AdminTagItem } from './types'

interface TagGroupProps {
  items: AdminTagItem[]
  maxVisible?: number
  size?: 'sm' | 'compact' | 'lg'
  emptyLabel?: string
  className?: string
  onItemClick?: (item: AdminTagItem) => void
}

export const TagGroup = memo(function TagGroup({
  items,
  maxVisible = 2,
  size = 'compact',
  emptyLabel = 'No tags assigned',
  className,
  onItemClick,
}: TagGroupProps) {
  const [expanded, setExpanded] = useState(false)
  const listId = useId()

  const visible = useMemo(() => {
    if (expanded || items.length <= maxVisible) return items
    return items.slice(0, maxVisible)
  }, [expanded, items, maxVisible])

  const hiddenCount = items.length - maxVisible

  const toggleExpanded = useCallback(() => {
    setExpanded((v) => !v)
  }, [])

  if (items.length === 0) {
    return (
      <span className="text-theme-xs text-gray-400 dark:text-gray-500" role="status">
        {emptyLabel}
      </span>
    )
  }

  return (
    <div
      className={`flex max-w-full flex-wrap items-center gap-1 ${className ?? ''}`}
      role="list"
      aria-label="Tags"
      style={{ minHeight: '1.5rem' }}
    >
      {visible.map((item, index) => (
        <span key={item.id ?? `${item.label}-${index}`} role="listitem">
          <AdminTag
            label={item.label}
            tone={item.tone}
            variant={item.variant ?? 'metadata'}
            size={size}
            title={item.title ?? item.label}
            disabled={item.disabled}
            interactive={Boolean(onItemClick)}
            onClick={onItemClick ? () => onItemClick(item) : undefined}
          />
        </span>
      ))}

      {!expanded && hiddenCount > 0 && (
        <button
          type="button"
          onClick={toggleExpanded}
          className="text-theme-xs focus-visible:ring-brand-500 inline-flex h-5 min-w-[1.75rem] items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-1.5 font-medium text-gray-600 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          aria-expanded={false}
          aria-controls={listId}
          title={items
            .slice(maxVisible)
            .map((i) => i.label)
            .join(', ')}
        >
          +{hiddenCount}
        </button>
      )}

      {expanded && hiddenCount > 0 && (
        <button
          type="button"
          onClick={toggleExpanded}
          className="text-theme-xs focus-visible:ring-brand-500 text-gray-500 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2"
          aria-expanded={true}
        >
          Show less
        </button>
      )}

      {expanded && hiddenCount > 0 && (
        <div id={listId} className="sr-only">
          {items
            .slice(maxVisible)
            .map((i) => i.label)
            .join(', ')}
        </div>
      )}
    </div>
  )
})
