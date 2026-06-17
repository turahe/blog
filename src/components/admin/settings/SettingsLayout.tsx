'use client'

import type { SaveStatus } from '@/modules/settings/types'
import { useSettingsContext } from './SettingsContext'
import { SaveIndicator } from './SaveIndicator'

interface SettingsLayoutProps {
  title: string
  description: string
  sidebar: React.ReactNode
  children: React.ReactNode
  onSave?: () => void
  onReset?: () => void
  saveStatus?: SaveStatus
  showActions?: boolean
}

export function SettingsLayout({
  title,
  description,
  sidebar,
  children,
  onSave,
  onReset,
  saveStatus: externalStatus,
  showActions = true,
}: SettingsLayoutProps) {
  const ctx = useSettingsContext()
  const saveStatus = externalStatus ?? ctx.saveStatus
  const dirty = ctx.hasUnsavedChanges

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-start sm:justify-between dark:border-gray-800">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white/90">{title}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        {showActions && (
          <div className="flex flex-wrap items-center gap-3">
            <SaveIndicator status={saveStatus} dirty={dirty} />
            {onReset && (
              <button type="button" onClick={onReset} className="admin-btn-secondary">
                Reset to default
              </button>
            )}
            {onSave && (
              <button
                type="button"
                onClick={onSave}
                disabled={saveStatus === 'saving' || !dirty}
                className="admin-btn-primary"
              >
                {saveStatus === 'saving' ? 'Saving…' : 'Save changes'}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)]">
        <aside>{sidebar}</aside>
        <div className="min-w-0 space-y-6">{children}</div>
      </div>
    </div>
  )
}
