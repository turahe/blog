'use client'

import { useMemo, useState, useCallback, useEffect } from 'react'
import { AdminTag } from '@/components/admin/tags'
import type { PermissionItem } from '../types'
import { filterPermissionGroups, groupPermissions } from '../utils/permissions'

interface PermissionManagerProps {
  catalog: PermissionItem[]
  selectedIds: string[]
  originalIds: string[]
  onChange: (ids: string[]) => void
  disabled?: boolean
}

export function PermissionManager({
  catalog,
  selectedIds,
  originalIds,
  onChange,
  disabled,
}: PermissionManagerProps) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [activeGroup, setActiveGroup] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 200)
    return () => clearTimeout(timer)
  }, [query])

  const groups = useMemo(() => groupPermissions(catalog), [catalog])
  const filteredGroups = useMemo(
    () => filterPermissionGroups(groups, debouncedQuery, activeGroup),
    [groups, debouncedQuery, activeGroup]
  )

  const selected = useMemo(() => new Set(selectedIds), [selectedIds])
  const original = useMemo(() => new Set(originalIds), [originalIds])

  const togglePermission = useCallback(
    (id: string) => {
      if (disabled) return
      const next = new Set(selectedIds)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      onChange([...next])
    },
    [disabled, onChange, selectedIds]
  )

  const selectAllVisible = () => {
    const visibleIds = filteredGroups.flatMap((g) => g.permissions.map((p) => p.id))
    onChange([...new Set([...selectedIds, ...visibleIds])])
  }

  const selectCategory = (groupKey: string) => {
    const group = groups.find((g) => g.key === groupKey)
    if (!group) return
    const ids = group.permissions.map((p) => p.id)
    onChange([...new Set([...selectedIds, ...ids])])
  }

  const clearSelection = () => onChange([])

  const toggleCollapse = (key: string) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/40">
      <div className="sticky top-0 z-10 space-y-3 border-b border-gray-200 bg-white/95 p-4 backdrop-blur dark:border-gray-800 dark:bg-gray-900/95">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search permissions…"
            className="admin-input min-w-[12rem] flex-1"
            aria-label="Search permissions"
          />
          <select
            value={activeGroup ?? ''}
            onChange={(e) => setActiveGroup(e.target.value || null)}
            className="admin-select"
            aria-label="Filter by category"
          >
            <option value="">All categories</option>
            {groups.map((g) => (
              <option key={g.key} value={g.key}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="admin-btn-secondary text-xs"
            onClick={selectAllVisible}
            disabled={disabled}
          >
            Select visible
          </button>
          {activeGroup && (
            <button
              type="button"
              className="admin-btn-secondary text-xs"
              onClick={() => selectCategory(activeGroup)}
              disabled={disabled}
            >
              Select category
            </button>
          )}
          <button
            type="button"
            className="admin-btn-secondary text-xs"
            onClick={clearSelection}
            disabled={disabled}
          >
            Clear selection
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 'min(70vh, 720px)' }}>
        {filteredGroups.length === 0 ? (
          <p className="text-theme-sm py-8 text-center text-gray-500">
            No permissions match your search.
          </p>
        ) : (
          <div className="space-y-3">
            {filteredGroups.map((group) => {
              const isCollapsed = collapsed[group.key] ?? false
              const groupSelected = group.permissions.filter((p) => selected.has(p.id)).length

              return (
                <section
                  key={group.key}
                  className="rounded-lg border border-gray-100 dark:border-gray-800"
                  aria-label={`${group.label} permissions`}
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-white/5"
                    onClick={() => toggleCollapse(group.key)}
                    aria-expanded={!isCollapsed}
                  >
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {group.label}
                    </span>
                    <span className="text-theme-xs text-gray-500">
                      {groupSelected}/{group.permissions.length}
                    </span>
                  </button>

                  {!isCollapsed && (
                    <ul className="divide-y divide-gray-100 border-t border-gray-100 dark:divide-gray-800 dark:border-gray-800">
                      {group.permissions.map((permission) => (
                        <PermissionRow
                          key={permission.id}
                          permission={permission}
                          checked={selected.has(permission.id)}
                          changeState={
                            selected.has(permission.id) && !original.has(permission.id)
                              ? 'added'
                              : !selected.has(permission.id) && original.has(permission.id)
                                ? 'removed'
                                : 'unchanged'
                          }
                          disabled={disabled}
                          onToggle={() => togglePermission(permission.id)}
                        />
                      ))}
                    </ul>
                  )}
                </section>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function PermissionRow({
  permission,
  checked,
  changeState,
  disabled,
  onToggle,
}: {
  permission: PermissionItem
  checked: boolean
  changeState: 'added' | 'removed' | 'unchanged'
  disabled?: boolean
  onToggle: () => void
}) {
  return (
    <li className="flex items-start gap-3 px-4 py-2.5">
      <input
        type="checkbox"
        id={`perm-${permission.id}`}
        checked={checked}
        onChange={onToggle}
        disabled={disabled}
        className="admin-checkbox mt-0.5"
      />
      <label htmlFor={`perm-${permission.id}`} className="min-w-0 flex-1 cursor-pointer">
        <span className="text-theme-sm flex flex-wrap items-center gap-2 font-medium text-gray-800 dark:text-gray-200">
          {permission.name}
          {changeState === 'added' && (
            <AdminTag label="+ Added" variant="metadata" tone="success" size="sm" />
          )}
          {changeState === 'removed' && (
            <AdminTag label="− Removed" variant="metadata" tone="critical" size="sm" />
          )}
        </span>
        <span className="text-theme-xs mt-0.5 block font-mono text-gray-400">
          {permission.slug}
        </span>
        {permission.description && (
          <span className="text-theme-xs mt-0.5 block text-gray-500">{permission.description}</span>
        )}
      </label>
    </li>
  )
}
