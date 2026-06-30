'use client'

import { memo, useMemo, useState } from 'react'
import { AdminTag } from './AdminTag'
import { formatGroupLabel } from './tag-styles'

type PermissionLike = {
  id?: string
  slug: string
  name: string
  group?: string
}

interface PermissionTagGroupProps {
  permissions: PermissionLike[]
  defaultCollapsed?: boolean
  maxActionsVisible?: number
}

type Grouped = {
  key: string
  label: string
  actions: { slug: string; label: string }[]
}

function parsePermission(permission: PermissionLike): { group: string; action: string } {
  if (permission.group) {
    const action = permission.slug.includes('.')
      ? permission.slug.split('.').slice(1).join('.')
      : permission.name
    return { group: permission.group, action }
  }

  const [group, ...rest] = permission.slug.split('.')
  return {
    group: group ?? 'general',
    action: rest.length > 0 ? rest.join('.') : permission.name,
  }
}

function formatActionLabel(action: string): string {
  return action
    .split(/[._-]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export const PermissionTagGroup = memo(function PermissionTagGroup({
  permissions,
  defaultCollapsed = true,
  maxActionsVisible = 4,
}: PermissionTagGroupProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const groups = useMemo(() => {
    const map = new Map<string, Grouped>()

    for (const permission of permissions) {
      const { group, action } = parsePermission(permission)
      const key = group.toLowerCase()
      const entry = map.get(key) ?? {
        key,
        label: formatGroupLabel(group),
        actions: [],
      }
      entry.actions.push({
        slug: permission.slug,
        label: formatActionLabel(action),
      })
      map.set(key, entry)
    }

    return [...map.values()].sort((a, b) => a.label.localeCompare(b.label))
  }, [permissions])

  if (groups.length === 0) {
    return <span className="text-theme-xs text-gray-400">No permissions</span>
  }

  return (
    <div className="space-y-2">
      {groups.map((group) => {
        const isCollapsed = collapsed[group.key] ?? defaultCollapsed
        const visibleActions = isCollapsed
          ? group.actions.slice(0, maxActionsVisible)
          : group.actions
        const hidden = group.actions.length - visibleActions.length

        return (
          <section
            key={group.key}
            className="rounded-lg border border-gray-100 px-3 py-2 dark:border-gray-800"
          >
            <button
              type="button"
              className="mb-1.5 flex w-full items-center justify-between text-left"
              onClick={() => setCollapsed((prev) => ({ ...prev, [group.key]: !isCollapsed }))}
              aria-expanded={!isCollapsed}
            >
              <span className="text-theme-sm font-medium text-gray-800 dark:text-gray-200">
                {group.label}{' '}
                <span className="font-normal text-gray-400">({group.actions.length})</span>
              </span>
              <span className="text-theme-xs text-gray-400">
                {isCollapsed ? 'Expand' : 'Collapse'}
              </span>
            </button>

            <div className="flex flex-wrap gap-1">
              {visibleActions.map((action) => (
                <AdminTag
                  key={action.slug}
                  label={action.label}
                  variant="permission"
                  tone="neutral"
                  size="sm"
                  title={action.slug}
                />
              ))}
              {isCollapsed && hidden > 0 && (
                <AdminTag
                  label={`+${hidden}`}
                  variant="metadata"
                  tone="neutral"
                  size="sm"
                  interactive
                  onClick={() => setCollapsed((prev) => ({ ...prev, [group.key]: false }))}
                />
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
})
