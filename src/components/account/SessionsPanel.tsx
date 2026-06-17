'use client'

import { useEffect, useState } from 'react'
import { formatDate } from '@/lib/formatDate'
import { ensureCsrfTokenAction } from '@/modules/auth/actions/csrf'
import { revokeOtherSessionsAction, revokeSessionAction } from '@/modules/account/actions'
import type { AccountSessionView } from '@/modules/account/types'
import { AccountCard } from './AccountCard'
import { useAccountUi } from './AccountUiContext'

interface SessionsPanelProps {
  sessions: AccountSessionView[]
}

export function SessionsPanel({ sessions: initialSessions }: SessionsPanelProps) {
  const { showToast } = useAccountUi()
  const [sessions, setSessions] = useState(initialSessions)
  const [csrfToken, setCsrfToken] = useState<string | null>(null)

  useEffect(() => {
    ensureCsrfTokenAction()
      .then(setCsrfToken)
      .catch(() => {})
  }, [])

  const revoke = async (sessionId: string) => {
    if (!csrfToken) return
    const result = await revokeSessionAction(sessionId, csrfToken)
    if (!result.success) {
      showToast(result.error ?? 'Failed to revoke session', 'error')
      return
    }
    setSessions((prev) => prev.filter((s) => s.id !== sessionId))
    showToast('Session revoked')
  }

  const revokeOthers = async () => {
    if (!csrfToken) return
    const result = await revokeOtherSessionsAction(csrfToken)
    if (!result.success) {
      showToast(result.error ?? 'Failed to revoke sessions', 'error')
      return
    }
    setSessions((prev) => prev.filter((s) => s.isCurrent))
    showToast('Other devices signed out')
  }

  return (
    <AccountCard
      title="Active sessions"
      description="Manage devices that are currently signed in to your account."
    >
      <div className="mb-4 flex justify-end">
        <button type="button" className="admin-btn-secondary" onClick={revokeOthers}>
          Logout other devices
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="text-theme-sm min-w-full text-left">
          <thead className="text-theme-xs border-b border-gray-200 text-gray-500 dark:border-gray-800">
            <tr>
              <th className="px-3 py-2 font-medium">Device</th>
              <th className="px-3 py-2 font-medium">Browser</th>
              <th className="px-3 py-2 font-medium">OS</th>
              <th className="px-3 py-2 font-medium">IP</th>
              <th className="px-3 py-2 font-medium">Last active</th>
              <th className="px-3 py-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id} className="border-b border-gray-100 dark:border-gray-800/80">
                <td className="px-3 py-3 text-gray-900 dark:text-white">
                  <div className="flex items-center gap-2">
                    {session.device}
                    {session.isCurrent && (
                      <span className="bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 rounded-full px-2 py-0.5 text-[11px] font-medium">
                        Current device
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{session.browser}</td>
                <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{session.os}</td>
                <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{session.ip ?? '—'}</td>
                <td className="px-3 py-3 text-gray-600 dark:text-gray-300">
                  {formatDate(session.lastActiveAt)}
                </td>
                <td className="px-3 py-3 text-right">
                  {!session.isCurrent && (
                    <button
                      type="button"
                      className="admin-btn-danger !px-3 !py-1.5 text-xs"
                      onClick={() => revoke(session.id)}
                    >
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AccountCard>
  )
}
