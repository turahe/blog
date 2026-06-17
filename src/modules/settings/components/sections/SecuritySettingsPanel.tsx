'use client'

import { useRouter } from 'next/navigation'
import { SettingsCard } from '@/components/admin/settings/SettingsCard'
import { SettingsField } from '@/components/admin/settings/SettingsField'
import { ToggleSwitch } from '@/components/admin/settings/ToggleSwitch'
import { ConfirmDialog } from '@/components/admin/settings/ConfirmDialog'
import { revokeSessionAction } from '@/modules/settings/actions'
import { useSettingsSection } from '@/modules/settings/hooks/useSettingsSection'
import { useSettingsContext } from '@/components/admin/settings/SettingsContext'
import type { SessionListItem, SettingsMap } from '@/modules/settings/types'
import { useState } from 'react'

export function SecuritySettingsPanel({
  initialValues,
  sessions,
}: {
  initialValues: SettingsMap
  sessions: SessionListItem[]
}) {
  const { values, update, setBool } = useSettingsSection('security', initialValues)
  const { showToast } = useSettingsContext()
  const router = useRouter()
  const [revokeId, setRevokeId] = useState<string | null>(null)

  const handleRevoke = async () => {
    if (!revokeId) return
    const result = await revokeSessionAction(revokeId)
    setRevokeId(null)
    showToast(
      result.success ? 'Session revoked' : (result.error ?? 'Failed'),
      result.success ? 'success' : 'error'
    )
    if (result.success) router.refresh()
  }

  return (
    <>
      <SettingsCard title="Authentication policy">
        <ToggleSwitch
          label="Two-factor authentication"
          description="Require 2FA for admin accounts (coming soon)."
          checked={values['security.two_factor_enabled'] === 'true'}
          onChange={(c) => setBool('security.two_factor_enabled', c)}
        />
        <SettingsField label="Session timeout (minutes)">
          <input
            className="admin-input"
            type="number"
            min={15}
            value={values['security.session_timeout'] ?? '1440'}
            onChange={(e) => update('security.session_timeout', e.target.value)}
          />
        </SettingsField>
        <SettingsField label="Minimum password length">
          <input
            className="admin-input"
            type="number"
            min={6}
            max={128}
            value={values['security.password_min_length'] ?? '8'}
            onChange={(e) => update('security.password_min_length', e.target.value)}
          />
        </SettingsField>
        <ToggleSwitch
          label="Require special characters"
          checked={values['security.password_require_special'] === 'true'}
          onChange={(c) => setBool('security.password_require_special', c)}
        />
      </SettingsCard>

      <SettingsCard
        title="Active sessions"
        description="Devices currently signed in to your account."
      >
        {sessions.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No active sessions.</p>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {sessions.map((session) => (
              <li
                key={session.id}
                className="flex flex-wrap items-center justify-between gap-3 py-4"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {session.userAgent?.slice(0, 80) ?? 'Unknown device'}
                    {session.isCurrent && (
                      <span className="bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 ml-2 rounded-full px-2 py-0.5 text-xs">
                        Current
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {session.ip ?? 'Unknown IP'} · {new Date(session.createdAt).toLocaleString()}
                  </p>
                </div>
                {!session.isCurrent && (
                  <button
                    type="button"
                    onClick={() => setRevokeId(session.id)}
                    className="admin-btn-danger"
                  >
                    Revoke
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </SettingsCard>

      <ConfirmDialog
        open={!!revokeId}
        title="Revoke session?"
        message="This device will be signed out immediately."
        confirmLabel="Revoke"
        onCancel={() => setRevokeId(null)}
        onConfirm={() => void handleRevoke()}
      />
    </>
  )
}
