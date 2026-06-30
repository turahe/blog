'use client'

import { AdminTag } from '@/components/admin/tags'

interface RoleInfoPanelProps {
  name: string
  description: string
  slug: string
  isSystem: boolean
  userCount: number
  updatedAt: string
  onNameChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onSlugChange: (value: string) => void
  slugDisabled?: boolean
  metadataDirty?: boolean
}

export function RoleInfoPanel({
  name,
  description,
  slug,
  isSystem,
  userCount,
  updatedAt,
  onNameChange,
  onDescriptionChange,
  onSlugChange,
  slugDisabled,
  metadataDirty,
}: RoleInfoPanelProps) {
  return (
    <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900/40">
      <div className="flex flex-wrap gap-1.5">
        <AdminTag
          label={isSystem ? 'System Role' : 'Custom Role'}
          variant="role"
          tone={isSystem ? 'neutral' : 'info'}
          size="compact"
        />
        <AdminTag label="Guard: web" variant="environment" tone="neutral" size="sm" />
        {metadataDirty && (
          <AdminTag label="Unsaved metadata" variant="metadata" tone="warning" size="sm" />
        )}
      </div>

      <div className="admin-field">
        <label htmlFor="role-name" className="admin-label">
          Role Name
        </label>
        <input
          id="role-name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="admin-input"
          required
        />
      </div>

      <div className="admin-field">
        <label htmlFor="role-slug" className="admin-label">
          Slug
        </label>
        <input
          id="role-slug"
          value={slug}
          onChange={(e) => onSlugChange(e.target.value)}
          className="admin-input font-mono text-sm"
          disabled={slugDisabled}
          aria-describedby={slugDisabled ? 'role-slug-hint' : undefined}
        />
        {slugDisabled && (
          <p id="role-slug-hint" className="text-theme-xs mt-1 text-gray-500">
            System role slugs cannot be changed.
          </p>
        )}
      </div>

      <div className="admin-field">
        <label htmlFor="role-description" className="admin-label">
          Description
        </label>
        <textarea
          id="role-description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="admin-input min-h-[5rem] resize-y"
          rows={3}
        />
      </div>

      <dl className="text-theme-sm grid grid-cols-2 gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
        <div>
          <dt className="text-gray-500">Assigned users</dt>
          <dd className="font-medium text-gray-900 dark:text-gray-100">{userCount}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Last updated</dt>
          <dd className="font-medium text-gray-900 dark:text-gray-100">{updatedAt}</dd>
        </div>
      </dl>
    </div>
  )
}
