'use client'

import { useEffect, useRef } from 'react'
import { MediaCard } from './MediaCard'
import { MediaEmptyState, MediaSkeleton } from './MediaEmptyState'
import { useMediaContext } from './MediaContext'
import type { MediaItem } from '@/modules/media/types'

interface MediaGridProps {
  items: MediaItem[]
  loading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  onCopy: (url: string) => void
  onDelete: (id: string) => void
  onRename: (id: string) => void
  onMove: (id: string) => void
  onUpload?: () => void
}

export function MediaGrid({
  items,
  loading,
  hasMore,
  onLoadMore,
  onCopy,
  onDelete,
  onRename,
  onMove,
  onUpload,
}: MediaGridProps) {
  const { setItems } = useMediaContext()
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setItems(items)
  }, [items, setItems])

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

  if (loading && !items.length) return <MediaSkeleton />

  if (!loading && !items.length) return <MediaEmptyState onUpload={onUpload} />

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {items.map((item, index) => (
          <MediaCard
            key={item.id}
            item={item}
            index={index}
            onCopy={onCopy}
            onDelete={onDelete}
            onRename={onRename}
            onMove={onMove}
          />
        ))}
      </div>
      {loading && items.length > 0 && (
        <div className="py-4 text-center text-sm text-gray-500">Loading more…</div>
      )}
      <div ref={sentinelRef} className="h-1" />
    </>
  )
}
