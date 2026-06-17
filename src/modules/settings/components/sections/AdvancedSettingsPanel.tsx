'use client'

import { useState } from 'react'
import { SettingsCard } from '@/components/admin/settings/SettingsCard'
import { SettingsField } from '@/components/admin/settings/SettingsField'
import { NotificationBroadcastForm } from '@/components/notifications/NotificationBroadcastForm'
import { sendTestNotificationAction } from '@/modules/notifications/actions'
import { useSettingsSection } from '@/modules/settings/hooks/useSettingsSection'
import type { AdvancedSystemInfo, SettingsMap } from '@/modules/settings/types'

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function AdvancedSettingsPanel({
  initialValues,
  systemInfo,
}: {
  initialValues: SettingsMap
  systemInfo: AdvancedSystemInfo
}) {
  const { values, update } = useSettingsSection('advanced', initialValues)
  const [broadcastMessage, setBroadcastMessage] = useState<string | null>(null)
  const [testingNotification, setTestingNotification] = useState(false)

  const handleTestNotification = async () => {
    setTestingNotification(true)
    const result = await sendTestNotificationAction()
    setTestingNotification(false)
    setBroadcastMessage(
      result.success
        ? 'Test notification sent to your inbox.'
        : (result.error ?? 'Failed to send test notification.')
    )
  }

  return (
    <>
      <SettingsCard
        title="Custom code"
        description="Inject scripts or styles site-wide. Use with caution."
      >
        <SettingsField label="Header scripts" hint="Inserted before </head>.">
          <textarea
            className="admin-textarea font-mono text-sm"
            rows={6}
            value={values['advanced.header_scripts'] ?? ''}
            onChange={(e) => update('advanced.header_scripts', e.target.value)}
          />
        </SettingsField>
        <SettingsField label="Footer scripts" hint="Inserted before </body>.">
          <textarea
            className="admin-textarea font-mono text-sm"
            rows={6}
            value={values['advanced.footer_scripts'] ?? ''}
            onChange={(e) => update('advanced.footer_scripts', e.target.value)}
          />
        </SettingsField>
        <SettingsField label="Custom CSS">
          <textarea
            className="admin-textarea font-mono text-sm"
            rows={8}
            value={values['advanced.custom_css'] ?? ''}
            onChange={(e) => update('advanced.custom_css', e.target.value)}
          />
        </SettingsField>
      </SettingsCard>

      <SettingsCard title="Storage">
        <SettingsField label="Storage driver">
          <select
            className="admin-select max-w-xs"
            value={values['storage.driver'] ?? 'minio'}
            onChange={(e) => update('storage.driver', e.target.value)}
          >
            <option value="minio">MinIO (S3-compatible)</option>
            <option value="local">Local filesystem</option>
          </select>
        </SettingsField>
      </SettingsCard>

      <SettingsCard
        title="System announcements"
        description="Broadcast maintenance notices or announcements to your team."
      >
        <NotificationBroadcastForm
          onSuccess={(count) => setBroadcastMessage(`Broadcast delivered to ${count} users.`)}
        />
        {broadcastMessage && (
          <p className="text-success-600 dark:text-success-400 mt-3 text-sm">{broadcastMessage}</p>
        )}
        <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-800">
          <button
            type="button"
            onClick={() => void handleTestNotification()}
            disabled={testingNotification}
            className="admin-btn-secondary"
          >
            {testingNotification ? 'Sending…' : 'Send test notification to me'}
          </button>
        </div>
      </SettingsCard>

      <SettingsCard title="Environment">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
            <dt className="text-xs text-gray-500 uppercase">Node environment</dt>
            <dd className="mt-1 font-medium text-gray-900 dark:text-white/90">
              {systemInfo.nodeEnv}
            </dd>
          </div>
          <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
            <dt className="text-xs text-gray-500 uppercase">Next.js</dt>
            <dd className="mt-1 font-medium text-gray-900 dark:text-white/90">
              {systemInfo.nextVersion}
            </dd>
          </div>
          <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
            <dt className="text-xs text-gray-500 uppercase">Database</dt>
            <dd
              className={`mt-1 font-medium ${
                systemInfo.databaseStatus === 'connected'
                  ? 'text-success-600 dark:text-success-400'
                  : 'text-error-600 dark:text-error-400'
              }`}
            >
              {systemInfo.databaseStatus === 'connected' ? 'Connected' : 'Error'}
            </dd>
          </div>
          <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
            <dt className="text-xs text-gray-500 uppercase">Settings stored</dt>
            <dd className="mt-1 font-medium text-gray-900 dark:text-white/90">
              {systemInfo.settingsCount}
            </dd>
          </div>
          <div className="rounded-xl border border-gray-200 p-4 sm:col-span-2 dark:border-gray-800">
            <dt className="text-xs text-gray-500 uppercase">Media storage</dt>
            <dd className="mt-1 font-medium text-gray-900 dark:text-white/90">
              {systemInfo.mediaCount} files · {formatBytes(systemInfo.mediaBytes)}
            </dd>
          </div>
        </dl>
      </SettingsCard>
    </>
  )
}
