'use client'

import type { AccountHeaderData } from '@/modules/account/types'
import { AdminUserAvatar } from '@/components/admin/header/AdminUserAvatar'

export function AccountHeaderCard({ user }: { user: AccountHeaderData }) {
  return (
    <div className="shadow-theme-xs rounded-2xl border border-gray-200 bg-linear-to-br from-white to-gray-50 p-5 md:p-6 dark:border-gray-800 dark:from-gray-900 dark:to-gray-900/40">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <AdminUserAvatar name={user.fullName} avatar={user.avatar} size="lg" />
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold text-gray-900 dark:text-white">
              {user.fullName}
            </h1>
            <p className="text-theme-sm truncate text-gray-500 dark:text-gray-400">{user.email}</p>
            <span className="bg-brand-50 text-theme-xs text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 mt-2 inline-flex rounded-full px-2.5 py-0.5 font-medium">
              {user.primaryRole}
            </span>
          </div>
        </div>
        <div className="text-theme-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium text-gray-700 dark:text-gray-300">Member since</span>
          <p className="mt-0.5">{user.memberSinceLabel}</p>
        </div>
      </div>
    </div>
  )
}
