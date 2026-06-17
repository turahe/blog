'use client'

import { SettingsCard } from '@/components/admin/settings/SettingsCard'
import { SettingsField } from '@/components/admin/settings/SettingsField'
import { useSettingsSection } from '@/modules/settings/hooks/useSettingsSection'
import type { AdvancedSystemInfo, SettingsMap } from '@/modules/settings/types'

type StorageDriver = 'minio' | 'r2' | 'mock' | 'local'

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function driverLabel(driver: StorageDriver) {
  switch (driver) {
    case 'minio':
      return 'MinIO (S3-compatible)'
    case 'r2':
      return 'Cloudflare R2'
    case 'mock':
      return 'Mock (filesystem / CI)'
    case 'local':
      return 'Local filesystem'
    default:
      return driver
  }
}

export function StorageSettingsPanel({
  initialValues,
  systemInfo,
}: {
  initialValues: SettingsMap
  systemInfo: AdvancedSystemInfo
}) {
  const { values, update } = useSettingsSection('storage', initialValues)
  const driver = (values['storage.driver'] ?? 'minio') as StorageDriver

  return (
    <>
      <SettingsCard
        title="Storage driver"
        description="Choose where uploaded media is stored. Environment variables override these values when set at deploy time."
      >
        <SettingsField
          label="Driver"
          hint="MinIO or R2 for production. Mock/local for development and CI."
        >
          <select
            className="admin-select max-w-md"
            value={driver}
            onChange={(e) => update('storage.driver', e.target.value)}
          >
            <option value="minio">MinIO (S3-compatible)</option>
            <option value="r2">Cloudflare R2</option>
            <option value="mock">Mock (filesystem)</option>
            <option value="local">Local filesystem</option>
          </select>
        </SettingsField>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Active driver:{' '}
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {driverLabel(driver)}
          </span>
        </p>
      </SettingsCard>

      {driver === 'minio' && (
        <SettingsCard title="MinIO configuration">
          <div className="grid gap-5 md:grid-cols-2">
            <SettingsField label="Endpoint" hint="e.g. http://localhost:9000">
              <input
                className="admin-input"
                value={values['storage.minio.endpoint'] ?? ''}
                onChange={(e) => update('storage.minio.endpoint', e.target.value)}
              />
            </SettingsField>
            <SettingsField label="Public URL" hint="URL used in media links">
              <input
                className="admin-input"
                value={values['storage.minio.public_url'] ?? ''}
                onChange={(e) => update('storage.minio.public_url', e.target.value)}
              />
            </SettingsField>
            <SettingsField label="Bucket">
              <input
                className="admin-input"
                value={values['storage.minio.bucket'] ?? ''}
                onChange={(e) => update('storage.minio.bucket', e.target.value)}
              />
            </SettingsField>
            <SettingsField label="Region">
              <input
                className="admin-input"
                value={values['storage.minio.region'] ?? ''}
                onChange={(e) => update('storage.minio.region', e.target.value)}
              />
            </SettingsField>
            <SettingsField label="Access key">
              <input
                className="admin-input"
                value={values['storage.minio.access_key'] ?? ''}
                onChange={(e) => update('storage.minio.access_key', e.target.value)}
              />
            </SettingsField>
            <SettingsField label="Secret key">
              <input
                className="admin-input"
                type="password"
                autoComplete="off"
                value={values['storage.minio.secret_key'] ?? ''}
                onChange={(e) => update('storage.minio.secret_key', e.target.value)}
              />
            </SettingsField>
          </div>
        </SettingsCard>
      )}

      {driver === 'r2' && (
        <SettingsCard title="Cloudflare R2 configuration">
          <div className="grid gap-5 md:grid-cols-2">
            <SettingsField label="Account ID">
              <input
                className="admin-input"
                value={values['storage.r2.account_id'] ?? ''}
                onChange={(e) => update('storage.r2.account_id', e.target.value)}
              />
            </SettingsField>
            <SettingsField label="Bucket">
              <input
                className="admin-input"
                value={values['storage.r2.bucket'] ?? ''}
                onChange={(e) => update('storage.r2.bucket', e.target.value)}
              />
            </SettingsField>
            <SettingsField
              label="Public URL"
              hint="r2.dev subdomain or custom domain (e.g. https://storage.wach.id)"
            >
              <input
                className="admin-input"
                value={values['storage.r2.public_url'] ?? ''}
                onChange={(e) => update('storage.r2.public_url', e.target.value)}
              />
            </SettingsField>
            <SettingsField label="API endpoint" hint="Optional — defaults to account R2 endpoint">
              <input
                className="admin-input"
                placeholder="https://&lt;account_id&gt;.r2.cloudflarestorage.com"
                value={values['storage.r2.endpoint'] ?? ''}
                onChange={(e) => update('storage.r2.endpoint', e.target.value)}
              />
            </SettingsField>
            <SettingsField label="Region">
              <input
                className="admin-input"
                placeholder="auto"
                value={values['storage.r2.region'] ?? ''}
                onChange={(e) => update('storage.r2.region', e.target.value)}
              />
            </SettingsField>
            <SettingsField label="Access key ID">
              <input
                className="admin-input"
                value={values['storage.r2.access_key_id'] ?? ''}
                onChange={(e) => update('storage.r2.access_key_id', e.target.value)}
              />
            </SettingsField>
            <div className="md:col-span-2">
              <SettingsField label="Secret access key">
                <input
                  className="admin-input"
                  type="password"
                  autoComplete="off"
                  value={values['storage.r2.secret_access_key'] ?? ''}
                  onChange={(e) => update('storage.r2.secret_access_key', e.target.value)}
                />
              </SettingsField>
            </div>
          </div>
        </SettingsCard>
      )}

      {(driver === 'mock' || driver === 'local') && (
        <SettingsCard
          title={driver === 'mock' ? 'Mock storage' : 'Local storage'}
          description="Files are written to a directory on the server filesystem."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <SettingsField label="Directory" hint="Relative to project root">
              <input
                className="admin-input"
                value={values['storage.mock.directory'] ?? ''}
                onChange={(e) => update('storage.mock.directory', e.target.value)}
              />
            </SettingsField>
            <SettingsField label="Public URL" hint="Base URL used in generated media links">
              <input
                className="admin-input"
                value={values['storage.mock.public_url'] ?? ''}
                onChange={(e) => update('storage.mock.public_url', e.target.value)}
              />
            </SettingsField>
            <SettingsField label="Bucket name" hint="Logical bucket folder inside the directory">
              <input
                className="admin-input"
                value={values['storage.mock.bucket'] ?? ''}
                onChange={(e) => update('storage.mock.bucket', e.target.value)}
              />
            </SettingsField>
          </div>
        </SettingsCard>
      )}

      <SettingsCard title="Usage">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
            <dt className="text-xs text-gray-500 uppercase">Media files</dt>
            <dd className="mt-1 font-medium text-gray-900 dark:text-white/90">
              {systemInfo.mediaCount} files · {formatBytes(systemInfo.mediaBytes)}
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
        </dl>
      </SettingsCard>
    </>
  )
}
