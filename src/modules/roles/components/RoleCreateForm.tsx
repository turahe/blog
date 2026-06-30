'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AdminTag } from '@/components/admin/tags'
import { createRoleAction } from '../actions'
import { PermissionManager } from './PermissionManager'
import type { PermissionItem } from '../types'

export function RoleCreateForm({ catalog }: { catalog: PermissionItem[] }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [permissionIds, setPermissionIds] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleNameChange = (value: string) => {
    setName(value)
    if (!slug || slug === slugify(name)) {
      setSlug(slugify(value))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const result = await createRoleAction({
      name,
      slug,
      description: description || undefined,
      permissionIds,
    })

    setSaving(false)
    if (!result.success || !result.data) {
      setError(result.error ?? 'Failed to create role')
      return
    }

    router.push(`/admin/roles/${result.data.id}`)
    router.refresh()
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
      {error && <p className="admin-error">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,30%)_minmax(0,70%)]">
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900/40">
          <AdminTag label="Custom Role" variant="role" tone="info" size="compact" />

          <div className="admin-field">
            <label htmlFor="new-role-name" className="admin-label">
              Role Name
            </label>
            <input
              id="new-role-name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="admin-input"
              required
            />
          </div>

          <div className="admin-field">
            <label htmlFor="new-role-slug" className="admin-label">
              Slug
            </label>
            <input
              id="new-role-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="admin-input font-mono text-sm"
              required
              pattern="[a-z0-9_-]+"
            />
          </div>

          <div className="admin-field">
            <label htmlFor="new-role-description" className="admin-label">
              Description
            </label>
            <textarea
              id="new-role-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="admin-input min-h-[5rem]"
              rows={3}
            />
          </div>

          <button type="submit" disabled={saving} className="admin-btn-primary w-full">
            {saving ? 'Creating…' : 'Create Role'}
          </button>
        </div>

        <PermissionManager
          catalog={catalog}
          selectedIds={permissionIds}
          originalIds={[]}
          onChange={setPermissionIds}
        />
      </div>
    </form>
  )
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50)
}
