'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  fetchNotificationsAction,
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from '@/modules/notifications/actions'
import type { NotificationView } from '@/modules/notifications/types'
import { NotificationToast } from './NotificationToast'

interface ToastEntry {
  id: string
  item: NotificationView
}

interface NotificationContextValue {
  items: NotificationView[]
  unreadCount: number
  loading: boolean
  refresh: () => Promise<void>
  markRead: (id: string) => Promise<void>
  markAllRead: () => Promise<void>
  prependItems: (items: NotificationView[]) => void
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

export function NotificationProvider({
  userId,
  children,
}: {
  userId: string
  children: ReactNode
}) {
  const [items, setItems] = useState<NotificationView[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [toasts, setToasts] = useState<ToastEntry[]>([])
  const seenIds = useRef(new Set<string>())
  const sinceRef = useRef(new Date().toISOString())

  const refresh = useCallback(async () => {
    const result = await fetchNotificationsAction({ tab: 'all', limit: 15 })
    if (result.success && result.data) {
      setItems(result.data.items)
      setUnreadCount(result.data.unreadCount)
      result.data.items.forEach((item) => seenIds.current.add(item.id))
    }
    setLoading(false)
  }, [])

  const markRead = useCallback(async (id: string) => {
    await markNotificationReadAction(id)
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, read: true, readAt: new Date().toISOString() } : item
      )
    )
    setUnreadCount((count) => Math.max(0, count - 1))
  }, [])

  const markAllRead = useCallback(async () => {
    await markAllNotificationsReadAction()
    setItems((prev) =>
      prev.map((item) => ({ ...item, read: true, readAt: item.readAt ?? new Date().toISOString() }))
    )
    setUnreadCount(0)
  }, [])

  const prependItems = useCallback((incoming: NotificationView[]) => {
    if (incoming.length === 0) return
    setItems((prev) => {
      const merged = [...incoming, ...prev.filter((p) => !incoming.some((i) => i.id === p.id))]
      return merged.slice(0, 30)
    })
    const fresh = incoming.filter((item) => !seenIds.current.has(item.id))
    fresh.forEach((item) => seenIds.current.add(item.id))
    if (fresh.length > 0) {
      setUnreadCount((count) => count + fresh.filter((item) => !item.read).length)
      setToasts((prev) =>
        [
          ...fresh.slice(0, 3).map((item) => ({ id: `${item.id}-${Date.now()}`, item })),
          ...prev,
        ].slice(0, 3)
      )
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    const source = new EventSource(
      `/api/notifications/stream?since=${encodeURIComponent(sinceRef.current)}`
    )

    source.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as {
          type: string
          unreadCount?: number
          items?: NotificationView[]
        }
        if (payload.type === 'sync') {
          if (typeof payload.unreadCount === 'number') setUnreadCount(payload.unreadCount)
          if (payload.items?.length) prependItems(payload.items)
        }
      } catch {
        // ignore malformed events
      }
    }

    return () => source.close()
  }, [prependItems, userId])

  useEffect(() => {
    if (toasts.length === 0) return
    const timers = toasts.map((toast) =>
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id))
      }, 5000)
    )
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [toasts])

  const dismissToast = (toastId: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId))
  }

  const value = useMemo(
    () => ({ items, unreadCount, loading, refresh, markRead, markAllRead, prependItems }),
    [items, unreadCount, loading, refresh, markRead, markAllRead, prependItems]
  )

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed top-4 right-4 z-[400] flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <NotificationToast
            key={toast.id}
            item={toast.item}
            onDismiss={() => dismissToast(toast.id)}
            onView={() => {
              void markRead(toast.item.id)
              dismissToast(toast.id)
            }}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}
