'use client'

import { SettingsCard } from '@/components/admin/settings/SettingsCard'
import { SettingsField } from '@/components/admin/settings/SettingsField'
import { ToggleSwitch } from '@/components/admin/settings/ToggleSwitch'
import { useSettingsSection } from '@/modules/settings/hooks/useSettingsSection'
import type { SettingsMap } from '@/modules/settings/types'

export function CommentsSettingsPanel({ initialValues }: { initialValues: SettingsMap }) {
  const { values, update, setBool } = useSettingsSection('comments', initialValues)

  return (
    <>
      <SettingsCard title="Comment system">
        <ToggleSwitch
          label="Enable comments"
          description="Allow readers to comment on posts."
          checked={values['comments.enabled'] === 'true'}
          onChange={(c) => setBool('comments.enabled', c)}
        />
        <ToggleSwitch
          label="Require approval"
          description="Hold new comments for moderation."
          checked={values['comments.require_approval'] === 'true'}
          onChange={(c) => setBool('comments.require_approval', c)}
        />
        <ToggleSwitch
          label="Guest comments"
          description="Allow comments without an account."
          checked={values['comments.guest_enabled'] === 'true'}
          onChange={(c) => setBool('comments.guest_enabled', c)}
        />
        <ToggleSwitch
          label="Spam protection"
          description="Enable heuristic and Akismet filtering."
          checked={values['comments.spam_protection'] === 'true'}
          onChange={(c) => setBool('comments.spam_protection', c)}
        />
      </SettingsCard>

      <SettingsCard title="Moderation">
        <SettingsField label="Moderation level">
          <select
            className="admin-select"
            value={values['comments.moderation_level'] ?? 'medium'}
            onChange={(e) => update('comments.moderation_level', e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </SettingsField>
        <SettingsField label="Akismet API key">
          <input
            className="admin-input font-mono"
            type="password"
            value={values['comments.akismet_key'] ?? ''}
            onChange={(e) => update('comments.akismet_key', e.target.value)}
          />
        </SettingsField>
        <SettingsField label="Comment limit per post">
          <input
            className="admin-input"
            type="number"
            min={1}
            value={values['comments.limit_per_post'] ?? '100'}
            onChange={(e) => update('comments.limit_per_post', e.target.value)}
          />
        </SettingsField>
      </SettingsCard>
    </>
  )
}
