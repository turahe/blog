'use client'

import Link from 'next/link'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { formatNotificationTime } from '@/lib/notifications/format-time'
import type { NotificationView } from '@/modules/notifications/types'
import { getNotificationIcon } from './notification-icons'

interface NotificationToastProps {
  item: NotificationView
  onDismiss: () => void
  onView: () => void
}

export function NotificationToast({ item, onDismiss, onView }: NotificationToastProps) {
  const Icon = getNotificationIcon(item.type, item.category)

  return (
    <div
      role="status"
      className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900"
    >
      <div className="flex gap-3 p-4">
        <span className="bg-brand-50 dark:bg-brand-500/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
          <Icon className="text-brand-600 dark:text-brand-400 h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</p>
            <button
              type="button"
              onClick={onDismiss}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/10"
              aria-label="Dismiss"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
          <p className="text-theme-sm mt-1 line-clamp-2 text-gray-500 dark:text-gray-400">
            {item.message}
          </p>
          <p className="mt-1 text-[11px] text-gray-400">{formatNotificationTime(item.createdAt)}</p>
          <div className="mt-3 flex gap-2">
            {item.href ? (
              <Link
                href={item.href}
                onClick={onView}
                className="admin-btn-primary !px-3 !py-1.5 text-xs"
              >
                View
              </Link>
            ) : (
              <button
                type="button"
                onClick={onView}
                className="admin-btn-primary !px-3 !py-1.5 text-xs"
              >
                View
              </button>
            )}
            <button
              type="button"
              onClick={onDismiss}
              className="admin-btn-secondary !px-3 !py-1.5 text-xs"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
