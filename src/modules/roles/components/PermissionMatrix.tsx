'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { updateMatrixCellAction } from '../actions'
import type { RoleMatrixRow } from '../types'
import { formatGroupLabel } from '../utils/permissions'

interface PermissionMatrixProps {
  roles: { id: string; slug: string; name: string; isSystem: boolean }[]
  rows: RoleMatrixRow[]
}

type PendingMap = Record<string, Record<string, boolean>>

export function PermissionMatrix({ roles, rows }: PermissionMatrixProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [groupFilter, setGroupFilter] = useState('')
  const [pending, setPending] = useState<PendingMap>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 200)
    return () => clearTimeout(timer)
  }, [query])

  const groups = useMemo(() => {
    const set = new Set(rows.map((r) => r.permission.group))
    return [...set].sort()
  }, [rows])

  const filteredRows = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    return rows.filter((row) => {
      if (groupFilter && row.permission.group !== groupFilter) return false
      if (!q) return true
      return (
        row.permission.name.toLowerCase().includes(q) ||
        row.permission.slug.toLowerCase().includes(q)
      )
    })
  }, [rows, debouncedQuery, groupFilter])

  const getCellValue = useCallback(
    (roleId: string, permissionId: string, original: boolean) => {
      const rolePending = pending[roleId]
      if (rolePending && permissionId in rolePending) {
        return rolePending[permissionId]
      }
      return original
    },
    [pending]
  )

  const pendingCount = useMemo(() => {
    let count = 0
    for (const roleId of Object.keys(pending)) {
      count += Object.keys(pending[roleId]).length
    }
    return count
  }, [pending])

  const toggleCell = (roleId: string, permissionId: string, original: boolean) => {
    const role = roles.find((r) => r.id === roleId)
    if (!role || role.slug === 'superadmin') return

    const current = getCellValue(roleId, permissionId, original)
    const next = !current

    setPending((prev) => {
      const rolePending = { ...(prev[roleId] ?? {}) }
      if (next === original) {
        delete rolePending[permissionId]
      } else {
        rolePending[permissionId] = next
      }
      const nextPending = { ...prev }
      if (Object.keys(rolePending).length === 0) {
        delete nextPending[roleId]
      } else {
        nextPending[roleId] = rolePending
      }
      return nextPending
    })
  }

  const handleSave = async () => {
    if (!confirm(`Apply ${pendingCount} matrix change(s)?`)) return
    setSaving(true)
    setError(null)

    try {
      for (const [roleId, changes] of Object.entries(pending)) {
        for (const [permissionId, enabled] of Object.entries(changes)) {
          const result = await updateMatrixCellAction(roleId, permissionId, enabled)
          if (!result.success) {
            throw new Error(result.error ?? 'Failed to update permission')
          }
        }
      }
      setPending({})
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleKeyNav = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    rowIndex: number,
    colIndex: number
  ) => {
    const table = scrollRef.current
    if (!table) return

    const buttons = table.querySelectorAll<HTMLButtonElement>('button[data-matrix-cell]')
    const cols = roles.length
    let nextIndex = rowIndex * cols + colIndex

    if (e.key === 'ArrowRight') nextIndex += 1
    else if (e.key === 'ArrowLeft') nextIndex -= 1
    else if (e.key === 'ArrowDown') nextIndex += cols
    else if (e.key === 'ArrowUp') nextIndex -= cols
    else return

    e.preventDefault()
    buttons[nextIndex]?.focus()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search permissions…"
          className="admin-input min-w-[12rem] flex-1"
          aria-label="Search matrix permissions"
        />
        <select
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
          className="admin-select"
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {groups.map((g) => (
            <option key={g} value={g}>
              {formatGroupLabel(g)}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div
        ref={scrollRef}
        className="max-h-[calc(100vh-14rem)] overflow-auto rounded-xl border border-gray-200 dark:border-gray-800"
      >
        <table className="min-w-full border-collapse text-sm">
          <thead className="sticky top-0 z-20 bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="sticky left-0 z-30 min-w-[14rem] border-r border-b border-gray-200 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:border-gray-800 dark:bg-gray-900">
                Permission
              </th>
              {roles.map((role) => (
                <th
                  key={role.id}
                  className="min-w-[6rem] border-b border-gray-200 px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase dark:border-gray-800"
                  title={role.slug}
                >
                  {role.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={roles.length + 1} className="px-4 py-10 text-center text-gray-500">
                  No permissions match your filters.
                </td>
              </tr>
            ) : (
              filteredRows.map((row, rowIndex) => (
                <tr
                  key={row.permission.id}
                  className="border-t border-gray-100 dark:border-gray-800"
                >
                  <th
                    scope="row"
                    className="sticky left-0 z-10 border-r border-gray-100 bg-white px-4 py-2 text-left font-medium text-gray-800 dark:border-gray-800 dark:bg-gray-950"
                  >
                    <span className="block">{row.permission.name}</span>
                    <span className="text-theme-xs font-mono font-normal text-gray-400">
                      {row.permission.slug}
                    </span>
                  </th>
                  {roles.map((role, colIndex) => {
                    const original = row.roleAccess[role.id] ?? false
                    const value = getCellValue(role.id, row.permission.id, original)
                    const isPending =
                      pending[role.id] && row.permission.id in (pending[role.id] ?? {})
                    const readOnly = role.slug === 'superadmin'

                    return (
                      <td key={role.id} className="px-2 py-2 text-center">
                        <button
                          type="button"
                          data-matrix-cell
                          disabled={readOnly || saving}
                          onClick={() => toggleCell(role.id, row.permission.id, original)}
                          onKeyDown={(e) => handleKeyNav(e, rowIndex, colIndex)}
                          className={`focus:ring-brand-500 inline-flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold transition focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
                            value
                              ? 'border-success-200 bg-success-50 text-success-700 dark:border-success-500/30 dark:bg-success-500/10 dark:text-success-400'
                              : 'border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-900'
                          } ${isPending ? 'ring-2 ring-amber-400' : ''}`}
                          aria-label={`${value ? 'Revoke' : 'Grant'} ${row.permission.name} for ${role.name}`}
                          aria-pressed={value}
                        >
                          {value ? '✓' : '✕'}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pendingCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/50 dark:bg-amber-950/50">
          <p className="text-theme-sm font-medium text-amber-900 dark:text-amber-100">
            {pendingCount} unsaved matrix change{pendingCount === 1 ? '' : 's'}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => setPending({})}
              disabled={saving}
            >
              Discard
            </button>
            <button
              type="button"
              className="admin-btn-primary"
              onClick={() => void handleSave()}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
