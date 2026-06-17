'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ensureCsrfTokenAction } from '@/modules/auth/actions/csrf'
import { deleteAccountAction, exportAccountDataAction } from '@/modules/account/actions'
import { AccountCard } from './AccountCard'
import { useAccountUi } from './AccountUiContext'

export function DangerZone() {
  const router = useRouter()
  const { showToast } = useAccountUi()
  const [csrfToken, setCsrfToken] = useState<string | null>(null)
  const [exportPassword, setExportPassword] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState('')

  useEffect(() => {
    ensureCsrfTokenAction()
      .then(setCsrfToken)
      .catch(() => {})
  }, [])

  const handleExport = async () => {
    if (!csrfToken) return
    const result = await exportAccountDataAction({ password: exportPassword }, csrfToken)
    if (!result.success || !result.data) {
      showToast(result.error ?? 'Export failed', 'error')
      return
    }
    const blob = new Blob([result.data.json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `account-export-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
    setExportPassword('')
    showToast('Account data exported')
  }

  const handleDelete = async () => {
    if (!csrfToken) return
    const result = await deleteAccountAction(
      { password: deletePassword, confirmation: deleteConfirm },
      csrfToken
    )
    if (!result.success) {
      showToast(result.error ?? 'Failed to delete account', 'error')
      return
    }
    router.push(result.data?.redirect ?? '/login')
    router.refresh()
  }

  return (
    <>
      <AccountCard
        title="Danger zone"
        description="Irreversible and sensitive account actions."
        className="border-error-200 dark:border-error-500/30"
      >
        <div className="space-y-6">
          <div className="flex flex-col gap-3 rounded-xl border border-gray-200 p-4 sm:flex-row sm:items-end sm:justify-between dark:border-gray-800">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Export account data</p>
              <p className="text-theme-sm mt-1 text-gray-500">
                Download a JSON copy of your account data.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="password"
                className="admin-input"
                placeholder="Confirm password"
                value={exportPassword}
                onChange={(e) => setExportPassword(e.target.value)}
              />
              <button type="button" className="admin-btn-secondary" onClick={handleExport}>
                Export data
              </button>
            </div>
          </div>

          <div className="border-error-200 bg-error-50/40 dark:border-error-500/30 dark:bg-error-500/5 flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-error-700 dark:text-error-400 font-medium">Delete account</p>
              <p className="text-theme-sm text-error-600/80 dark:text-error-400/80 mt-1">
                Permanently delete your account and sign out everywhere.
              </p>
            </div>
            <button type="button" className="admin-btn-danger" onClick={() => setDeleteOpen(true)}>
              Delete account
            </button>
          </div>
        </div>
      </AccountCard>

      {deleteOpen && (
        <div className="fixed inset-0 z-[260] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-gray-900/50"
            aria-label="Close"
            onClick={() => setDeleteOpen(false)}
          />
          <div className="border-error-200 dark:border-error-500/30 relative w-full max-w-md rounded-2xl border bg-white p-6 dark:bg-gray-900">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete account</h3>
            <p className="text-theme-sm mt-2 text-gray-600 dark:text-gray-400">
              This action cannot be undone. Enter your password and type DELETE to confirm.
            </p>
            <div className="mt-4 space-y-3">
              <input
                type="password"
                className="admin-input"
                placeholder="Password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
              />
              <input
                className="admin-input"
                placeholder="Type DELETE"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={() => setDeleteOpen(false)}
              >
                Cancel
              </button>
              <button type="button" className="admin-btn-danger" onClick={handleDelete}>
                Delete permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
