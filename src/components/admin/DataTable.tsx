'use client'

import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useState, useTransition } from 'react'
import { FilterTags, StatusTag, TagGroup } from '@/components/admin/tags'
import type { AdminTagItem } from '@/components/admin/tags'

export type DataTableCellVariant = 'text' | 'badge' | 'link' | 'tags'

export interface DataTableColumn {
  key: string
  label: string
  sortable?: boolean
  variant?: DataTableCellVariant
}

export type DataTableCellValue = string | number | null | undefined | AdminTagItem[]

export interface DataTableRow {
  id: string
  [key: string]: DataTableCellValue
}

interface DataTableProps {
  columns: DataTableColumn[]
  data: DataTableRow[]
  total: number
  page: number
  pageSize: number
  searchPlaceholder?: string
  rowHrefKey?: string
  rowLinkKey?: string
  rowLinkLabel?: string
  emptyMessage?: string
  showFilterTags?: boolean
  toolbarExtra?: React.ReactNode
  bulkActions?: {
    label: string
    action: (ids: string[]) => Promise<void | unknown>
  }[]
  exportCsv?: () => void
}

function renderCell(value: DataTableCellValue, variant: DataTableCellVariant = 'text') {
  if (variant === 'tags') {
    if (!Array.isArray(value)) {
      return <span className="text-theme-xs text-gray-400">—</span>
    }
    return <TagGroup items={value} maxVisible={2} size="sm" />
  }

  const display = value === null || value === undefined || value === '' ? '—' : String(value)

  if (variant === 'badge') {
    if (display === '—') return display
    return <StatusTag label={display} />
  }

  if (variant === 'link') {
    if (display === '—') return display
    return (
      <Link href={display} className="admin-link">
        {display}
      </Link>
    )
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
  rowLinkKey,
  rowLinkLabel = 'Edit',
  emptyMessage = 'No records found',
  showFilterTags = true,
  toolbarExtra,
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

  const navigateToRow = useCallback(
    (row: DataTableRow) => {
      const hrefKey = rowLinkKey ?? rowHrefKey
      if (!hrefKey) return
      const href = row[hrefKey]
      if (href) router.push(String(href))
    },
    [router, rowHrefKey, rowLinkKey]
  )

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
      {showFilterTags && <FilterTags />}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="admin-input max-w-xs"
            aria-label="Search table"
          />
          <button type="submit" className="admin-btn-primary">
            Search
          </button>
          {toolbarExtra}
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

      <div className="admin-table-wrap max-h-[calc(100vh-16rem)] overflow-auto">
        <table className="min-w-full">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/95">
              {bulkActions && (
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.size === data.length && data.length > 0}
                    onChange={toggleAll}
                    aria-label="Select all rows"
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
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => {
                const isRowClickable = Boolean(rowLinkKey ?? rowHrefKey)
                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-gray-50 dark:hover:bg-white/2 ${isRowClickable ? 'cursor-pointer' : ''}`}
                    onClick={isRowClickable ? () => navigateToRow(row) : undefined}
                    onKeyDown={
                      isRowClickable
                        ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              navigateToRow(row)
                            }
                          }
                        : undefined
                    }
                    tabIndex={isRowClickable ? 0 : undefined}
                    role={isRowClickable ? 'link' : undefined}
                    aria-label={
                      isRowClickable ? `Open ${row.name ?? row.slug ?? row.id}` : undefined
                    }
                  >
                    {bulkActions && (
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selected.has(row.id)}
                          onChange={() => toggleOne(row.id)}
                          aria-label={`Select row ${row.id}`}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`text-theme-sm px-4 py-3 text-gray-800 dark:text-gray-200 ${
                          col.variant === 'tags' ? 'max-w-[14rem]' : ''
                        }`}
                      >
                        {renderCell(row[col.key], col.variant)}
                      </td>
                    ))}
                    {showActions && rowHrefKey && (
                      <td
                        className="px-4 py-3 text-right text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
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
                )
              })
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
