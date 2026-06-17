'use client'

import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useState, useTransition } from 'react'

export type DataTableCellVariant = 'text' | 'badge' | 'link'

export interface DataTableColumn {
  key: string
  label: string
  sortable?: boolean
  variant?: DataTableCellVariant
}

export interface DataTableRow {
  id: string
  [key: string]: string | number | null | undefined
}

interface DataTableProps {
  columns: DataTableColumn[]
  data: DataTableRow[]
  total: number
  page: number
  pageSize: number
  searchPlaceholder?: string
  rowHrefKey?: string
  rowLinkLabel?: string
  bulkActions?: {
    label: string
    action: (ids: string[]) => Promise<void | unknown>
  }[]
  exportCsv?: () => void
}

function renderCell(
  value: string | number | null | undefined,
  variant: DataTableCellVariant = 'text'
) {
  const display = value === null || value === undefined || value === '' ? '—' : String(value)

  if (variant === 'badge') {
    return <span className="admin-badge">{display}</span>
  }

  return display
}

export function DataTable({
  columns,
  data,
  total,
  page,
  pageSize,
  searchPlaceholder = 'Search...',
  rowHrefKey,
  rowLinkLabel = 'Edit',
  bulkActions,
  exportCsv,
}: DataTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState(searchParams.get('search') ?? '')

  const totalPages = Math.ceil(total / pageSize) || 1
  const showActions = Boolean(rowHrefKey)

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([k, v]) => {
        if (v === null) params.delete(k)
        else params.set(k, v)
      })
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`)
      })
    },
    [pathname, router, searchParams]
  )

  const toggleAll = () => {
    if (selected.size === data.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(data.map((r) => r.id)))
    }
  }

  const toggleOne = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateParams({ search: search || null, page: '1' })
  }

  const handleSort = (key: string) => {
    const current = searchParams.get('sortBy')
    const order = searchParams.get('sortOrder')
    if (current === key && order === 'asc') {
      updateParams({ sortBy: key, sortOrder: 'desc' })
    } else {
      updateParams({ sortBy: key, sortOrder: 'asc' })
    }
  }

  return (
    <div className={`space-y-4 ${isPending ? 'opacity-60' : ''}`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="admin-input max-w-xs"
          />
          <button type="submit" className="admin-btn-primary">
            Search
          </button>
        </form>

        <div className="flex gap-2">
          {exportCsv && (
            <button onClick={exportCsv} className="admin-btn-secondary">
              Export CSV
            </button>
          )}
          {bulkActions?.map((ba) => (
            <button
              key={ba.label}
              disabled={selected.size === 0}
              onClick={async () => {
                await ba.action([...selected])
                setSelected(new Set())
                router.refresh()
              }}
              className="admin-btn-danger disabled:opacity-40"
            >
              {ba.label} ({selected.size})
            </button>
          ))}
        </div>
      </div>

      <div className="admin-table-wrap overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
              {bulkActions && (
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.size === data.length && data.length > 0}
                    onChange={toggleAll}
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-theme-xs px-4 py-3 text-left font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                >
                  {col.sortable ? (
                    <button onClick={() => handleSort(col.key)} className="hover:text-brand-500">
                      {col.label}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
              {showActions && (
                <th className="text-theme-xs px-4 py-3 text-right font-medium text-gray-500 uppercase">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (bulkActions ? 1 : 0) + (showActions ? 1 : 0)}
                  className="text-theme-sm px-4 py-10 text-center text-gray-500"
                >
                  No records found
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-white/2">
                  {bulkActions && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(row.id)}
                        onChange={() => toggleOne(row.id)}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="text-theme-sm px-4 py-3 text-gray-800 dark:text-gray-200"
                    >
                      {renderCell(row[col.key], col.variant)}
                    </td>
                  ))}
                  {showActions && rowHrefKey && (
                    <td className="px-4 py-3 text-right text-sm">
                      {row[rowHrefKey] ? (
                        <Link href={String(row[rowHrefKey])} className="admin-link">
                          {rowLinkLabel}
                        </Link>
                      ) : (
                        '—'
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-theme-sm flex items-center justify-between text-gray-500 dark:text-gray-400">
        <span>
          Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
        </span>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => updateParams({ page: String(page - 1) })}
            className="admin-btn-secondary !px-3 !py-1.5 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="flex items-center px-2 py-1 font-medium text-gray-700 dark:text-gray-300">
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => updateParams({ page: String(page + 1) })}
            className="admin-btn-secondary !px-3 !py-1.5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
