'use client'

import { useEffect, useMemo, useState } from 'react'
import { AdminTag } from '@/components/admin/tags'
import { previewUserRoleChangesAction, validateSelfRoleChangeAction } from '@/modules/roles/actions'

interface RoleOption {
  id: string
  name: string
  slug: string
}

interface UserRoleAssignmentPanelProps {
  userId: string
  roles: RoleOption[]
  initialRoleIds: string[]
  value: string[]
  onChange: (roleIds: string[]) => void
}

export function UserRoleAssignmentPanel({
  userId,
  roles,
  initialRoleIds,
  value,
  onChange,
}: UserRoleAssignmentPanelProps) {
  const [query, setQuery] = useState('')
  const [preview, setPreview] = useState<{
    added: number
    removed: number
    isIncrease: boolean
  } | null>(null)

  const filteredRoles = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return roles
    return roles.filter((r) => r.name.toLowerCase().includes(q) || r.slug.toLowerCase().includes(q))
  }, [roles, query])

  const selectedSet = useMemo(() => new Set(value), [value])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const sortedInitial = [...initialRoleIds].sort().join(',')
      const sortedValue = [...value].sort().join(',')
      if (sortedInitial === sortedValue) {
        setPreview(null)
        return
      }

      const result = await previewUserRoleChangesAction(userId, value)
      if (!cancelled && result.success && result.data) {
        setPreview({
          added: result.data.addedPermissionCount,
          removed: result.data.removedPermissionCount,
          isIncrease: result.data.isPrivilegeIncrease,
        })
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [userId, value, initialRoleIds])

  const applyRoleChange = async (nextIds: string[]) => {
    const validation = await validateSelfRoleChangeAction(userId, nextIds)
    if (!validation.success) {
      alert(validation.error)
      return
    }

    const previewResult = await previewUserRoleChangesAction(userId, nextIds)
    if (
      previewResult.success &&
      previewResult.data?.isPrivilegeIncrease &&
      previewResult.data.addedPermissionCount > 0
    ) {
      const confirmed = confirm(
        `This change grants ${previewResult.data.addedPermissionCount} additional permission${previewResult.data.addedPermissionCount === 1 ? '' : 's'}. Continue?`
      )
      if (!confirmed) return
    }

    onChange(nextIds)
  }

  const removeRole = (roleId: string) => {
    void applyRoleChange(value.filter((id) => id !== roleId))
  }

  const addRole = (roleId: string) => {
    if (selectedSet.has(roleId)) return
    void applyRoleChange([...value, roleId])
  }

  return (
    <fieldset className="admin-field">
      <legend className="admin-label">Assigned roles</legend>

      <div className="mb-3 flex flex-wrap gap-1" aria-label="Currently assigned roles">
        {value.length === 0 ? (
          <span className="text-theme-sm text-gray-500">No roles assigned</span>
        ) : (
          value.map((roleId) => {
            const role = roles.find((r) => r.id === roleId)
            if (!role) return null
            return (
              <AdminTag
                key={roleId}
                label={role.name}
                variant="role"
                tone={role.slug === 'admin' || role.slug === 'superadmin' ? 'info' : 'neutral'}
                size="compact"
                removable
                onRemove={() => removeRole(roleId)}
              />
            )
          })
        )}
      </div>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search roles to assign…"
        className="admin-input mb-3"
        aria-label="Search roles"
      />

      <div
        className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-gray-200 p-2 dark:border-gray-800"
        role="listbox"
        aria-label="Available roles"
      >
        {filteredRoles.map((role) => {
          const assigned = selectedSet.has(role.id)
          return (
            <button
              key={role.id}
              type="button"
              role="option"
              aria-selected={assigned}
              onClick={() => (assigned ? removeRole(role.id) : addRole(role.id))}
              className={`focus:ring-brand-500 flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm focus:ring-2 focus:outline-none ${
                assigned
                  ? 'bg-brand-50 text-brand-800 dark:bg-brand-500/10 dark:text-brand-300'
                  : 'hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              <span>{role.name}</span>
              <span className="text-theme-xs font-mono text-gray-400">{role.slug}</span>
            </button>
          )
        })}
      </div>

      {preview && (preview.added > 0 || preview.removed > 0) && (
        <p
          className={`text-theme-sm mt-3 rounded-lg px-3 py-2 ${
            preview.isIncrease
              ? 'bg-amber-50 text-amber-900 dark:bg-amber-950/50 dark:text-amber-100'
              : 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
          }`}
          role="status"
        >
          {preview.added > 0 && (
            <span>
              Grants {preview.added} additional permission{preview.added === 1 ? '' : 's'}
            </span>
          )}
          {preview.added > 0 && preview.removed > 0 && ' · '}
          {preview.removed > 0 && (
            <span>
              Removes {preview.removed} permission{preview.removed === 1 ? '' : 's'}
            </span>
          )}
        </p>
      )}
    </fieldset>
  )
}
