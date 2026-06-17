'use client'

import { SettingsCard } from '@/components/admin/settings/SettingsCard'
import { SettingsField } from '@/components/admin/settings/SettingsField'
import { useSettingsSection } from '@/modules/settings/hooks/useSettingsSection'
import type { SettingsMap } from '@/modules/settings/types'

const SOCIAL_FIELDS = [
  { key: 'social.facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/...' },
  { key: 'social.twitter', label: 'X / Twitter URL', placeholder: 'https://x.com/...' },
  { key: 'social.instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
  { key: 'social.linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/...' },
  { key: 'social.youtube', label: 'YouTube URL', placeholder: 'https://youtube.com/...' },
  { key: 'social.github', label: 'GitHub URL', placeholder: 'https://github.com/...' },
] as const

export function SocialSettingsPanel({ initialValues }: { initialValues: SettingsMap }) {
  const { values, update } = useSettingsSection('social', initialValues)

  const activeLinks = SOCIAL_FIELDS.filter((f) => values[f.key]?.trim())

  return (
    <>
      <SettingsCard
        title="Social profiles"
        description="Links used in footer, author pages, and Open Graph."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {SOCIAL_FIELDS.map((field) => (
            <SettingsField key={field.key} label={field.label}>
              <input
                className="admin-input"
                type="url"
                placeholder={field.placeholder}
                value={values[field.key] ?? ''}
                onChange={(e) => update(field.key, e.target.value)}
              />
            </SettingsField>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Social preview">
        {activeLinks.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Add profile URLs to preview linked accounts.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {activeLinks.map((field) => (
              <li key={field.key}>
                <a
                  href={values[field.key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-500/10 inline-flex rounded-full border border-gray-200 px-3 py-1.5 text-sm dark:border-gray-700"
                >
                  {field.label.replace(' URL', '')}
                </a>
              </li>
            ))}
          </ul>
        )}
      </SettingsCard>
    </>
  )
}
