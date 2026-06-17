'use client'

import Link from 'next/link'
import { formatNotificationTime } from '@/lib/notifications/format-time'
import type { NotificationView } from '@/modules/notifications/types'
import { getNotificationIcon } from './notification-icons'

interface NotificationItemProps {
  item: NotificationView
  compact?: boolean
  onRead?: (id: string) => void
  onNavigate?: () => void
}

export function NotificationItem({
  item,
  compact = false,
  onRead,
  onNavigate,
}: NotificationItemProps) {
  const Icon = getNotificationIcon(item.type, item.category)

  const handleActivate = () => {
    onRead?.(item.id)
    onNavigate?.()
  }

  const className = `flex w-full gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-gray-50 dark:hover:bg-white/5 ${
    item.read ? 'opacity-80' : 'bg-brand-50/50 dark:bg-brand-500/5'
  }`

  const content = (
    <>
      <span
        className={`shadow-theme-xs flex shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700 ${
          compact ? 'h-9 w-9' : 'h-10 w-10'
        }`}
      >
        <Icon className="text-brand-600 dark:text-brand-400 h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span
            className={`font-medium text-gray-900 dark:text-white ${compact ? 'text-theme-sm' : 'text-sm'}`}
          >
            {item.title}
          </span>
          {!item.read && (
            <span
              className="bg-brand-500 mt-1.5 h-2 w-2 shrink-0 rounded-full"
              aria-hidden="true"
            />
          )}
        </span>
        <span
          className={`mt-0.5 block text-gray-500 dark:text-gray-400 ${compact ? 'text-theme-xs line-clamp-2' : 'text-theme-sm line-clamp-3'}`}
        >
          {item.message}
        </span>
        <span className="mt-1.5 block text-[11px] text-gray-400">
          {formatNotificationTime(item.createdAt)}
        </span>
      </span>
    </>
  )

  if (item.href) {
    return (
      <Link href={item.href} className={className} onClick={handleActivate}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" className={className} onClick={handleActivate}>
      {content}
    </button>
  )
}
