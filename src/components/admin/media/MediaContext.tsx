'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { MEDIA_VIEW_MODE_KEY } from '@/modules/media/constants'
import type { MediaItem, MediaViewMode } from '@/modules/media/types'

type Toast = { id: number; message: string; type: 'success' | 'error' }

type MediaContextValue = {
  viewMode: MediaViewMode
  setViewMode: (mode: MediaViewMode) => void
  selectedIds: Set<string>
  toggleSelect: (id: string, index: number, shiftKey?: boolean) => void
  selectAll: (ids: string[]) => void
  clearSelection: () => void
  isSelected: (id: string) => boolean
  activeItem: MediaItem | null
  setActiveItem: (item: MediaItem | null) => void
  previewItem: MediaItem | null
  setPreviewItem: (item: MediaItem | null) => void
  showToast: (message: string, type?: 'success' | 'error') => void
  lastSelectedIndex: number | null
  setItems: (items: MediaItem[]) => void
  items: MediaItem[]
}

const MediaContext = createContext<MediaContextValue | null>(null)

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewModeState] = useState<MediaViewMode>(() => {
    if (typeof window === 'undefined') return 'grid'
    return (localStorage.getItem(MEDIA_VIEW_MODE_KEY) as MediaViewMode) || 'grid'
  })
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null)
  const [activeItem, setActiveItem] = useState<MediaItem | null>(null)
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null)
  const [items, setItems] = useState<MediaItem[]>([])
  const [toasts, setToasts] = useState<Toast[]>([])

  const setViewMode = useCallback((mode: MediaViewMode) => {
    setViewModeState(mode)
    localStorage.setItem(MEDIA_VIEW_MODE_KEY, mode)
  }, [])

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now()
    setToasts((p) => [...p, { id, message, type }])
    window.setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000)
  }, [])

  const toggleSelect = useCallback(
    (id: string, index: number, shiftKey?: boolean) => {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        if (shiftKey && lastSelectedIndex !== null) {
          const start = Math.min(lastSelectedIndex, index)
          const end = Math.max(lastSelectedIndex, index)
          const rangeIds = items.slice(start, end + 1).map((i) => i.id)
          rangeIds.forEach((rid) => next.add(rid))
        } else if (next.has(id)) {
          next.delete(id)
        } else {
          next.add(id)
        }
        return next
      })
      setLastSelectedIndex(index)
    },
    [items, lastSelectedIndex]
  )

  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds(new Set(ids))
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set())
    setLastSelectedIndex(null)
  }, [])

  const value = useMemo(
    () => ({
      viewMode,
      setViewMode,
      selectedIds,
      toggleSelect,
      selectAll,
      clearSelection,
      isSelected: (id: string) => selectedIds.has(id),
      activeItem,
      setActiveItem,
      previewItem,
      setPreviewItem,
      showToast,
      lastSelectedIndex,
      setItems,
      items,
    }),
    [
      viewMode,
      setViewMode,
      selectedIds,
      toggleSelect,
      selectAll,
      clearSelection,
      activeItem,
      previewItem,
      showToast,
      lastSelectedIndex,
      items,
    ]
  )

  return (
    <MediaContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 bottom-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-xl border px-4 py-2.5 text-sm font-medium shadow-lg ${
              t.type === 'success'
                ? 'border-success-200 bg-success-50 text-success-700 dark:border-success-500/30 dark:bg-success-500/10 dark:text-success-400'
                : 'border-error-200 bg-error-50 text-error-700 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </MediaContext.Provider>
  )
}

export function useMediaContext() {
  const ctx = useContext(MediaContext)
  if (!ctx) throw new Error('useMediaContext requires MediaProvider')
  return ctx
}
