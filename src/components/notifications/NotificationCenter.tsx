'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  deleteNotificationAction,
  fetchNotificationsAction,
  markNotificationReadAction,
} from '@/modules/notifications/actions'
import type {
  NotificationDateRange,
  NotificationFilterCategory,
  NotificationFilterStatus,
  NotificationView,
} from '@/modules/notifications/types'
import { NotificationFilters } from './NotificationFilters'
import { NotificationItem } from './NotificationItem'
import { useNotifications } from './NotificationProvider'

export function NotificationCenter() {
  const { unreadCount, markAllRead } = useNotifications()
  const [items, setItems] = useState<NotificationView[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [category, setCategory] = useState<NotificationFilterCategory>('all')
  const [status, setStatus] = useState<NotificationFilterStatus>('all')
  const [range, setRange] = useState<NotificationDateRange>('all')
  const [search, setSearch] = useState('')
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const load = useCallback(
    async (append = false, nextCursor?: string | null) => {
      if (append) setLoadingMore(true)
      else setLoading(true)

      const result = await fetchNotificationsAction({
        category,
        status,
        range,
        search: search.trim() || undefined,
        cursor: append ? (nextCursor ?? undefined) : undefined,
        limit: 20,
      })

      if (result.success && result.data) {
        setItems((prev) => (append ? [...prev, ...result.data!.items] : result.data!.items))
        setCursor(result.data.nextCursor)
      }

      setLoading(false)
      setLoadingMore(false)
    },
    [category, status, range, search]
  )

  useEffect(() => {
    const timer = window.setTimeout(
      () => {
        void load(false)
      },
      search ? 300 : 0
    )
    return () => window.clearTimeout(timer)
  }, [load, search])

  useEffect(() => {
    const node = loadMoreRef.current
    if (!node || !cursor || loading || loadingMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void load(true, cursor)
        }
      },
      { rootMargin: '120px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [cursor, load, loading, loadingMore])

  const handleMarkRead = async (id: string) => {
    await markNotificationReadAction(id)
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)))
  }

  const handleDelete = async (id: string) => {
    await deleteNotificationAction(id)
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-theme-sm mt-1 text-gray-500 dark:text-gray-400">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button type="button" className="admin-btn-secondary" onClick={() => void markAllRead()}>
            Mark all as read
          </button>
        )}
      </div>

      <NotificationFilters
        category={category}
        status={status}
        range={range}
        search={search}
        onCategoryChange={setCategory}
        onStatusChange={setStatus}
        onRangeChange={setRange}
        onSearchChange={setSearch}
      />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/60">
        {loading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-20 animate-pulse rounded-xl bg-gray-100 dark:bg-white/5"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-theme-sm px-4 py-12 text-center text-gray-500 dark:text-gray-400">
            No notifications match your filters.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {items.map((item) => (
              <li key={item.id} className="group px-2 py-1">
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <NotificationItem item={item} onRead={(id) => void handleMarkRead(id)} />
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleDelete(item.id)}
                    className="text-theme-xs hover:text-error-600 mt-3 rounded-lg px-2 py-1 text-gray-400 opacity-0 transition group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-white/5"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {cursor && !loading && (
          <div
            ref={loadMoreRef}
            className="border-t border-gray-100 p-4 text-center dark:border-gray-800"
          >
            {loadingMore && (
              <div className="border-brand-500 mx-auto h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
