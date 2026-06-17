'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { SaveStatus } from '@/modules/settings/types'

type Toast = { id: number; message: string; type: 'success' | 'error' }

type SettingsContextValue = {
  saveStatus: SaveStatus
  setSaveStatus: (status: SaveStatus) => void
  hasUnsavedChanges: boolean
  setHasUnsavedChanges: (dirty: boolean) => void
  showToast: (message: string, type?: 'success' | 'error') => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3200)
  }, [])

  const value = useMemo(
    () => ({
      saveStatus,
      setSaveStatus,
      hasUnsavedChanges,
      setHasUnsavedChanges,
      showToast,
    }),
    [saveStatus, hasUnsavedChanges, showToast]
  )

  return (
    <SettingsContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 bottom-4 z-[100] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`shadow-theme-lg pointer-events-auto rounded-xl border px-4 py-3 text-sm font-medium ${
              toast.type === 'success'
                ? 'border-success-200 bg-success-50 text-success-700 dark:border-success-500/30 dark:bg-success-500/10 dark:text-success-400'
                : 'border-error-200 bg-error-50 text-error-700 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </SettingsContext.Provider>
  )
}

export function useSettingsContext() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettingsContext must be used within SettingsProvider')
  return ctx
}
