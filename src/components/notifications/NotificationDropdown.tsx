'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { BellIcon, CheckIcon } from '@heroicons/react/24/outline'
import { AdminDropdownPanel } from '@/components/admin/header/AdminDropdownPanel'
import { useAdminDropdown } from '@/components/admin/header/useAdminDropdown'
import { NotificationBadge } from './NotificationBadge'
import { NotificationItem } from './NotificationItem'
import { useNotifications } from './NotificationProvider'

interface NotificationDropdownProps {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export function NotificationDropdown({ isOpen, onOpen, onClose }: NotificationDropdownProps) {
  const { items, unreadCount, loading, markRead, markAllRead, refresh } = useNotifications()
  const { containerRef, triggerRef, menuId } = useAdminDropdown(isOpen, onClose)
  const [tab, setTab] = useState<'all' | 'unread'>('all')

  const visibleItems = useMemo(
    () => (tab === 'unread' ? items.filter((item) => !item.read) : items),
    [items, tab]
  )

  const handleToggle = () => {
    if (isOpen) {
      onClose()
    } else {
      onOpen()
      void refresh()
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
        className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition duration-150 ease-out lg:h-11 lg:w-11 ${
          isOpen
            ? 'bg-gray-100 text-gray-700 ring-1 ring-gray-200 dark:bg-white/8 dark:text-gray-200 dark:ring-gray-700'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200'
        }`}
      >
        <BellIcon className="h-5 w-5" aria-hidden="true" />
        <NotificationBadge count={unreadCount} />
      </button>

      <AdminDropdownPanel id={menuId} isOpen={isOpen} widthClass="w-[380px]">
        <div className="border-b border-gray-200 px-3 py-3 dark:border-gray-800">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</p>
              <p className="text-theme-xs text-gray-500 dark:text-gray-400">
                {unreadCount > 0 ? `${unreadCount} unread` : 'You are all caught up'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => void markAllRead()}
                className="text-theme-xs text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-500/10 inline-flex items-center gap-1 rounded-lg px-2 py-1 font-medium transition"
              >
                <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                Mark all read
              </button>
            )}
          </div>

          <div className="mt-3 flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-white/5">
            {(['all', 'unread'] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setTab(value)}
                className={`text-theme-xs flex-1 rounded-md px-3 py-1.5 font-medium capitalize transition ${
                  tab === value
                    ? 'shadow-theme-xs bg-white text-gray-900 dark:bg-gray-900 dark:text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[500px] overflow-y-auto px-1.5 py-1.5">
          {loading ? (
            <div className="space-y-2 p-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-16 animate-pulse rounded-xl bg-gray-100 dark:bg-white/5"
                />
              ))}
            </div>
          ) : visibleItems.length === 0 ? (
            <p className="text-theme-sm px-3 py-8 text-center text-gray-500 dark:text-gray-400">
              No notifications to show.
            </p>
          ) : (
            <ul className="space-y-1">
              {visibleItems.map((item) => (
                <li key={item.id}>
                  <NotificationItem
                    item={item}
                    compact
                    onRead={(id) => void markRead(id)}
                    onNavigate={onClose}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-gray-200 px-3 py-2.5 dark:border-gray-800">
          <Link
            href="/notifications"
            onClick={onClose}
            className="text-theme-sm text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-500/10 block rounded-lg px-3 py-2 text-center font-medium transition"
          >
            View all notifications
          </Link>
        </div>
      </AdminDropdownPanel>
    </div>
  )
}
