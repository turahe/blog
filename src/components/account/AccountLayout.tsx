'use client'

import type { ReactNode } from 'react'
import { SaveIndicator } from '@/components/admin/settings/SaveIndicator'
import { useAccountUi } from './AccountUiContext'

interface AccountLayoutProps {
  title: string
  description: string
  children: ReactNode
  onSave?: () => void
  showSaveBar?: boolean
}

export function AccountLayout({
  title,
  description,
  children,
  onSave,
  showSaveBar = true,
}: AccountLayoutProps) {
  const { saveStatus, isDirty } = useAccountUi()

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-start sm:justify-between dark:border-gray-800">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white/90">{title}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        {showSaveBar && onSave && (
          <div className="flex items-center gap-3">
            <SaveIndicator status={saveStatus} dirty={isDirty} />
            <button
              type="button"
              onClick={onSave}
              disabled={saveStatus === 'saving' || !isDirty}
              className="admin-btn-primary"
            >
              {saveStatus === 'saving' ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)]">
        <aside>{/* Sidebar injected by page shell */}</aside>
        <div className="min-w-0 space-y-6">{children}</div>
      </div>

      {showSaveBar && onSave && (
        <div className="fixed right-0 bottom-0 left-0 z-[120] border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur-md md:left-[90px] lg:left-[var(--account-sidebar-offset,90px)] dark:border-gray-800 dark:bg-gray-900/95">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
            <SaveIndicator status={saveStatus} dirty={isDirty} />
            <button
              type="button"
              onClick={onSave}
              disabled={saveStatus === 'saving' || !isDirty}
              className="admin-btn-primary"
            >
              {saveStatus === 'saving' ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
