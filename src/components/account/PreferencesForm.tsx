'use client'

import { useEffect, useState } from 'react'
import { useTheme } from '@/lib/theme/theme-provider'
import { ensureCsrfTokenAction } from '@/modules/auth/actions/csrf'
import { updatePreferencesAction } from '@/modules/account/actions'
import type { AccountPreferencesData } from '@/modules/account/types'
import { AccountCard } from './AccountCard'
import { useAccountUi } from './AccountUiContext'
import { SaveIndicator } from '@/components/admin/settings/SaveIndicator'

interface PreferencesFormProps {
  preferences: AccountPreferencesData
}

export function PreferencesForm({ preferences }: PreferencesFormProps) {
  const { theme, setTheme } = useTheme()
  const { setDirty, setSaveStatus, showToast, saveStatus, isDirty } = useAccountUi()
  const [csrfToken, setCsrfToken] = useState<string | null>(null)
  const [form, setForm] = useState(preferences)

  useEffect(() => {
    ensureCsrfTokenAction()
      .then(setCsrfToken)
      .catch(() => {})
  }, [])

  useEffect(() => {
    setDirty(JSON.stringify(form) !== JSON.stringify(preferences))
  }, [form, preferences, setDirty])

  const update = <K extends keyof AccountPreferencesData>(
    key: K,
    value: AccountPreferencesData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setSaveStatus('idle')
    if (key === 'appearance') {
      setTheme(value as 'light' | 'dark' | 'system')
    }
  }

  const handleSave = async () => {
    if (!csrfToken) return
    setSaveStatus('saving')
    const result = await updatePreferencesAction(form, csrfToken)
    if (!result.success) {
      setSaveStatus('error')
      showToast(result.error ?? 'Failed to save preferences', 'error')
      return
    }
    setSaveStatus('saved')
    setDirty(false)
    showToast('Preferences saved')
  }

  return (
    <>
      <AccountCard title="Appearance">
        <div className="flex flex-wrap gap-2">
          {(['light', 'dark', 'system'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => update('appearance', mode)}
              className={`text-theme-sm rounded-lg px-4 py-2 font-medium capitalize transition ${
                form.appearance === mode
                  ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
        <p className="text-theme-xs mt-2 text-gray-500">Current theme: {theme}</p>
      </AccountCard>

      <AccountCard title="Editor preferences">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="admin-label" htmlFor="editorMode">
              Default editor mode
            </label>
            <select
              id="editorMode"
              className="admin-select mt-1.5"
              value={form.editorMode}
              onChange={(e) =>
                update('editorMode', e.target.value as AccountPreferencesData['editorMode'])
              }
            >
              <option value="markdown">Markdown</option>
              <option value="rich-text">Rich text</option>
            </select>
          </div>
        </div>
      </AccountCard>

      <AccountCard title="Dashboard preferences">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="admin-label" htmlFor="landing">
              Default landing page
            </label>
            <input
              id="landing"
              className="admin-input mt-1.5"
              value={form.defaultLandingPage}
              onChange={(e) => update('defaultLandingPage', e.target.value)}
            />
          </div>
          <label className="text-theme-sm flex items-center gap-2 self-end text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={form.sidebarCollapsed}
              onChange={(e) => update('sidebarCollapsed', e.target.checked)}
            />
            Sidebar collapsed by default
          </label>
        </div>
      </AccountCard>

      <AccountCard title="Content preferences">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="admin-label" htmlFor="autosave">
              Autosave interval (seconds)
            </label>
            <input
              id="autosave"
              type="number"
              min={15}
              max={600}
              className="admin-input mt-1.5"
              value={form.autosaveInterval}
              onChange={(e) => update('autosaveInterval', Number(e.target.value))}
            />
          </div>
          <div>
            <label className="admin-label" htmlFor="postStatus">
              Default post status
            </label>
            <select
              id="postStatus"
              className="admin-select mt-1.5"
              value={form.defaultPostStatus}
              onChange={(e) =>
                update(
                  'defaultPostStatus',
                  e.target.value as AccountPreferencesData['defaultPostStatus']
                )
              }
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
      </AccountCard>

      <div className="fixed right-0 bottom-0 left-0 z-[120] border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur-md lg:left-[90px] dark:border-gray-800 dark:bg-gray-900/95">
        <div className="mx-auto flex max-w-4xl items-center justify-end gap-3">
          <SaveIndicator status={saveStatus} dirty={isDirty} />
          <button
            type="button"
            onClick={handleSave}
            disabled={saveStatus === 'saving' || !isDirty}
            className="admin-btn-primary"
          >
            {saveStatus === 'saving' ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </>
  )
}
