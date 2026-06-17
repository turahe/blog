'use client'

import { SettingsCard } from '@/components/admin/settings/SettingsCard'
import { SettingsField } from '@/components/admin/settings/SettingsField'
import { useSettingsSection } from '@/modules/settings/hooks/useSettingsSection'
import type { SettingsMap } from '@/modules/settings/types'

const TIMEZONES = ['UTC', 'Asia/Jakarta', 'Asia/Singapore', 'America/New_York', 'Europe/London']
const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'id', label: 'Indonesian' },
]
const DATE_FORMATS = ['MMMM d, yyyy', 'dd/MM/yyyy', 'yyyy-MM-dd', 'MMM d, yyyy']

export function GeneralSettingsPanel({ initialValues }: { initialValues: SettingsMap }) {
  const { values, update } = useSettingsSection('general', initialValues)

  return (
    <SettingsCard title="Site information" description="Basic identity and regional preferences.">
      <SettingsField label="Site name">
        <input
          className="admin-input"
          value={values['site.name'] ?? ''}
          onChange={(e) => update('site.name', e.target.value)}
        />
      </SettingsField>
      <SettingsField label="Site description">
        <textarea
          className="admin-textarea"
          rows={3}
          value={values['site.description'] ?? ''}
          onChange={(e) => update('site.description', e.target.value)}
        />
      </SettingsField>
      <SettingsField label="Site URL" hint="Used for canonical URLs and emails.">
        <input
          className="admin-input"
          type="url"
          value={values['site.url'] ?? ''}
          onChange={(e) => update('site.url', e.target.value)}
        />
      </SettingsField>
      <SettingsField label="Admin email">
        <input
          className="admin-input"
          type="email"
          value={values['site.admin_email'] ?? ''}
          onChange={(e) => update('site.admin_email', e.target.value)}
        />
      </SettingsField>
      <div className="grid gap-5 sm:grid-cols-3">
        <SettingsField label="Timezone">
          <select
            className="admin-select"
            value={values['site.timezone'] ?? 'UTC'}
            onChange={(e) => update('site.timezone', e.target.value)}
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </SettingsField>
        <SettingsField label="Language">
          <select
            className="admin-select"
            value={values['site.language'] ?? 'en'}
            onChange={(e) => update('site.language', e.target.value)}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </SettingsField>
        <SettingsField label="Date format">
          <select
            className="admin-select"
            value={values['site.date_format'] ?? 'MMMM d, yyyy'}
            onChange={(e) => update('site.date_format', e.target.value)}
          >
            {DATE_FORMATS.map((fmt) => (
              <option key={fmt} value={fmt}>
                {fmt}
              </option>
            ))}
          </select>
        </SettingsField>
      </div>
    </SettingsCard>
  )
}
