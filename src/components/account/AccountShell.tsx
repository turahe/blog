'use client'

import type { ReactNode } from 'react'
import { AccountHeaderCard } from './AccountHeaderCard'
import { AccountSidebar } from './AccountSidebar'
import { AccountUiProvider } from './AccountUiContext'
import type { AccountHeaderData } from '@/modules/account/types'

interface AccountShellProps {
  header: AccountHeaderData
  title: string
  description: string
  children: ReactNode
  actions?: ReactNode
}

export function AccountShell({ header, title, description, children, actions }: AccountShellProps) {
  return (
    <AccountUiProvider>
      <div className="space-y-6">
        <AccountHeaderCard user={header} />

        <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-start sm:justify-between dark:border-gray-800">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white/90">{title}</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
          </div>
          {actions}
        </div>

        <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)]">
          <AccountSidebar />
          <div className="min-w-0 space-y-6 pb-24">{children}</div>
        </div>
      </div>
    </AccountUiProvider>
  )
}
