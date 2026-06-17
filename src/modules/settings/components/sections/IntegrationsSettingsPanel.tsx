'use client'

import { useState } from 'react'
import { SettingsCard } from '@/components/admin/settings/SettingsCard'
import { SettingsField } from '@/components/admin/settings/SettingsField'
import { sendTestEmailAction } from '@/modules/settings/actions'
import { useSettingsSection } from '@/modules/settings/hooks/useSettingsSection'
import { useSettingsContext } from '@/components/admin/settings/SettingsContext'
import type { SettingsMap } from '@/modules/settings/types'

export function IntegrationsSettingsPanel({ initialValues }: { initialValues: SettingsMap }) {
  const { values, update } = useSettingsSection('integrations', initialValues)
  const { showToast } = useSettingsContext()
  const [testEmail, setTestEmail] = useState('')

  const handleTestEmail = async () => {
    const result = await sendTestEmailAction({ to: testEmail })
    showToast(
      result.success
        ? ((result.data as { message?: string })?.message ?? 'Test email sent')
        : (result.error ?? 'Failed'),
      result.success ? 'success' : 'error'
    )
  }

  return (
    <>
      <SettingsCard title="Analytics & verification">
        <div className="grid gap-5 md:grid-cols-2">
          <SettingsField label="Google Analytics ID">
            <input
              className="admin-input"
              placeholder="G-XXXXXXXX"
              value={values['integrations.ga_id'] ?? ''}
              onChange={(e) => update('integrations.ga_id', e.target.value)}
            />
          </SettingsField>
          <SettingsField label="Google Tag Manager ID">
            <input
              className="admin-input"
              placeholder="GTM-XXXX"
              value={values['integrations.gtm_id'] ?? ''}
              onChange={(e) => update('integrations.gtm_id', e.target.value)}
            />
          </SettingsField>
          <SettingsField label="Google Search Console verification">
            <input
              className="admin-input"
              value={values['integrations.gsc_verification'] ?? ''}
              onChange={(e) => update('integrations.gsc_verification', e.target.value)}
            />
          </SettingsField>
        </div>
      </SettingsCard>

      <SettingsCard title="Cloudflare Turnstile">
        <div className="grid gap-5 md:grid-cols-2">
          <SettingsField label="Site key">
            <input
              className="admin-input"
              value={values['integrations.turnstile_site_key'] ?? ''}
              onChange={(e) => update('integrations.turnstile_site_key', e.target.value)}
            />
          </SettingsField>
          <SettingsField label="Secret key">
            <input
              className="admin-input"
              type="password"
              value={values['integrations.turnstile_secret_key'] ?? ''}
              onChange={(e) => update('integrations.turnstile_secret_key', e.target.value)}
            />
          </SettingsField>
        </div>
      </SettingsCard>

      <SettingsCard title="SMTP email">
        <div className="grid gap-5 md:grid-cols-2">
          <SettingsField label="Host">
            <input
              className="admin-input"
              value={values['integrations.smtp_host'] ?? ''}
              onChange={(e) => update('integrations.smtp_host', e.target.value)}
            />
          </SettingsField>
          <SettingsField label="Port">
            <input
              className="admin-input"
              type="number"
              value={values['integrations.smtp_port'] ?? '587'}
              onChange={(e) => update('integrations.smtp_port', e.target.value)}
            />
          </SettingsField>
          <SettingsField label="Username">
            <input
              className="admin-input"
              value={values['integrations.smtp_username'] ?? ''}
              onChange={(e) => update('integrations.smtp_username', e.target.value)}
            />
          </SettingsField>
          <SettingsField label="Password">
            <input
              className="admin-input"
              type="password"
              value={values['integrations.smtp_password'] ?? ''}
              onChange={(e) => update('integrations.smtp_password', e.target.value)}
            />
          </SettingsField>
          <SettingsField label="Encryption">
            <select
              className="admin-select"
              value={values['integrations.smtp_encryption'] ?? 'tls'}
              onChange={(e) => update('integrations.smtp_encryption', e.target.value)}
            >
              <option value="none">None</option>
              <option value="tls">TLS</option>
              <option value="ssl">SSL</option>
            </select>
          </SettingsField>
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <SettingsField label="Send test email to">
            <input
              className="admin-input"
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </SettingsField>
          <button
            type="button"
            onClick={() => void handleTestEmail()}
            className="admin-btn-primary"
          >
            Send test email
          </button>
        </div>
      </SettingsCard>
    </>
  )
}
