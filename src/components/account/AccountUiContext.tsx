'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { SaveStatus } from '@/modules/account/types'

interface ToastMessage {
  id: number
  type: 'success' | 'error' | 'info'
  message: string
}

interface AccountUiContextValue {
  saveStatus: SaveStatus
  isDirty: boolean
  setSaveStatus: (status: SaveStatus) => void
  setDirty: (dirty: boolean) => void
  showToast: (message: string, type?: ToastMessage['type']) => void
}

const AccountUiContext = createContext<AccountUiContextValue | null>(null)

export function AccountUiProvider({ children }: { children: ReactNode }) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [isDirty, setDirty] = useState(false)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, type, message }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 3200)
  }, [])

  const value = useMemo(
    () => ({ saveStatus, isDirty, setSaveStatus, setDirty, showToast }),
    [isDirty, saveStatus, showToast]
  )

  return (
    <AccountUiContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 bottom-4 z-[300] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto rounded-xl border px-4 py-3 text-sm font-medium shadow-lg ${
              toast.type === 'success'
                ? 'border-success-200 bg-success-50 text-success-700 dark:border-success-500/30 dark:bg-success-500/10 dark:text-success-400'
                : toast.type === 'error'
                  ? 'border-error-200 bg-error-50 text-error-700 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400'
                  : 'border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </AccountUiContext.Provider>
  )
}

export function useAccountUi() {
  const ctx = useContext(AccountUiContext)
  if (!ctx) throw new Error('useAccountUi must be used within AccountUiProvider')
  return ctx
}
