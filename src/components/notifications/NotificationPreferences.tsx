'use client'

import { useEffect, useState } from 'react'
import { ensureCsrfTokenAction } from '@/modules/auth/actions/csrf'
import { updateNotificationPrefsAction } from '@/modules/notifications/actions'
import type {
  EmailNotificationPrefsExtended,
  InAppNotificationPrefs,
} from '@/modules/notifications/types'
import { AccountCard } from '@/components/account/AccountCard'
import { ToggleRow } from '@/components/account/ToggleRow'
import { useAccountUi } from '@/components/account/AccountUiContext'

interface NotificationPreferencesProps {
  initialEmail: EmailNotificationPrefsExtended
  initialInApp: InAppNotificationPrefs
}

export function NotificationPreferences({
  initialEmail,
  initialInApp,
}: NotificationPreferencesProps) {
  const { showToast, setDirty, setSaveStatus } = useAccountUi()
  const [csrfToken, setCsrfToken] = useState<string | null>(null)
  const [email, setEmail] = useState(initialEmail)
  const [inApp, setInApp] = useState(initialInApp)

  useEffect(() => {
    ensureCsrfTokenAction()
      .then(setCsrfToken)
      .catch(() => {})
  }, [])

  useEffect(() => {
    setDirty(
      JSON.stringify(email) !== JSON.stringify(initialEmail) ||
        JSON.stringify(inApp) !== JSON.stringify(initialInApp)
    )
  }, [email, inApp, initialEmail, initialInApp, setDirty])

  const handleSave = async () => {
    if (!csrfToken) return
    setSaveStatus('saving')
    const result = await updateNotificationPrefsAction({ email, inApp }, csrfToken)
    if (!result.success) {
      setSaveStatus('error')
      showToast(result.error ?? 'Failed to save preferences', 'error')
      return
    }
    setSaveStatus('saved')
    setDirty(false)
    showToast('Notification preferences saved')
  }

  return (
    <>
      <AccountCard title="Email notifications" description="Choose which events send email alerts.">
        <div className="space-y-2">
          <ToggleRow
            label="Comments"
            checked={email.comments}
            onChange={(v) => setEmail((p) => ({ ...p, comments: v }))}
          />
          <ToggleRow
            label="Content updates"
            checked={email.contentUpdates}
            onChange={(v) => setEmail((p) => ({ ...p, contentUpdates: v }))}
          />
          <ToggleRow
            label="Security alerts"
            checked={email.securityAlerts}
            onChange={(v) => setEmail((p) => ({ ...p, securityAlerts: v }))}
          />
          <ToggleRow
            label="System alerts"
            checked={email.systemAlerts}
            onChange={(v) => setEmail((p) => ({ ...p, systemAlerts: v }))}
          />
        </div>
      </AccountCard>

      <AccountCard
        title="In-app notifications"
        description="Control what appears in your notification center."
      >
        <div className="space-y-2">
          <ToggleRow
            label="Comments"
            checked={inApp.comments}
            onChange={(v) => setInApp((p) => ({ ...p, comments: v }))}
          />
          <ToggleRow
            label="Content updates"
            checked={inApp.contentUpdates}
            onChange={(v) => setInApp((p) => ({ ...p, contentUpdates: v }))}
          />
          <ToggleRow
            label="Mentions"
            checked={inApp.mentions}
            onChange={(v) => setInApp((p) => ({ ...p, mentions: v }))}
          />
          <ToggleRow
            label="Reviews"
            checked={inApp.reviews}
            onChange={(v) => setInApp((p) => ({ ...p, reviews: v }))}
          />
          <ToggleRow
            label="Security"
            checked={inApp.security}
            onChange={(v) => setInApp((p) => ({ ...p, security: v }))}
          />
          <ToggleRow
            label="System"
            checked={inApp.system}
            onChange={(v) => setInApp((p) => ({ ...p, system: v }))}
          />
        </div>
      </AccountCard>

      <div className="flex justify-end">
        <button type="button" className="admin-btn-primary" onClick={() => void handleSave()}>
          Save preferences
        </button>
      </div>
    </>
  )
}
