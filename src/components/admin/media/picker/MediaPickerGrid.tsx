'use client'

import { useEffect, useRef } from 'react'
import type { MediaItem } from '@/modules/media/types'
import { MediaPickerCard } from './MediaPickerCard'
import { MediaSkeleton } from '../MediaEmptyState'

interface MediaPickerGridProps {
  items: MediaItem[]
  selectedId: string | null
  onSelect: (item: MediaItem) => void
  loading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
}

export function MediaPickerGrid({
  items,
  selectedId,
  onSelect,
  loading,
  hasMore,
  onLoadMore,
}: MediaPickerGridProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!hasMore || !onLoadMore) return
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) onLoadMore()
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, onLoadMore])

  if (loading && items.length === 0) {
    return <MediaSkeleton count={12} />
  }

  if (!loading && items.length === 0) {
    return (
      <div className="flex h-full min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-8 text-center dark:border-gray-700 dark:bg-gray-900/30">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">No images found</p>
        <p className="mt-1 text-xs text-gray-500">Upload a new image or try a different search.</p>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto pr-1">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {items.map((item) => (
          <MediaPickerCard
            key={item.id}
            item={item}
            selected={selectedId === item.id}
            onSelect={onSelect}
          />
        ))}
      </div>
      {loading && items.length > 0 && (
        <p className="py-4 text-center text-xs text-gray-500">Loading more…</p>
      )}
      <div ref={sentinelRef} className="h-2" />
    </div>
  )
}
