'use client'

import { useMemo, useState } from 'react'
import type { RbacAuditEntry } from '../types'

interface RbacAuditTimelineProps {
  entries: RbacAuditEntry[]
}

export function RbacAuditTimeline({ entries }: RbacAuditTimelineProps) {
  const [actorFilter, setActorFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const filtered = useMemo(() => {
    return entries.filter((entry) => {
      if (actorFilter) {
        const q = actorFilter.toLowerCase()
        if (
          !entry.actorEmail.toLowerCase().includes(q) &&
          !entry.actorName.toLowerCase().includes(q)
        ) {
          return false
        }
      }
      return true
    })
  }, [entries, actorFilter])

  return (
    <section
      className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900/40"
      aria-label="Role audit timeline"
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Audit timeline</h3>
          <p className="text-theme-sm text-gray-500">
            Recent changes to this role and its permissions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            type="search"
            value={actorFilter}
            onChange={(e) => setActorFilter(e.target.value)}
            placeholder="Filter by actor"
            className="admin-input text-sm"
            aria-label="Filter audit by actor"
          />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="admin-input text-sm"
            aria-label="Filter from date"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="admin-input text-sm"
            aria-label="Filter to date"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-theme-sm py-6 text-center text-gray-500">No audit events yet.</p>
      ) : (
        <ol className="relative space-y-0 border-l border-gray-200 pl-6 dark:border-gray-700">
          {filtered.map((entry) => (
            <li key={entry.id} className="relative pb-6 last:pb-0">
              <span
                className="bg-brand-500 absolute top-1.5 -left-[7px] h-3 w-3 rounded-full border-2 border-white dark:border-gray-900"
                aria-hidden
              />
              <time className="text-theme-xs font-mono text-gray-400">{entry.createdAt}</time>
              <p className="text-theme-sm mt-0.5 font-medium text-gray-900 dark:text-gray-100">
                {entry.actorName}{' '}
                <span className="font-normal text-gray-500">({entry.actorEmail})</span>
              </p>
              <p className="text-theme-sm mt-1 text-gray-600 dark:text-gray-300">{entry.summary}</p>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
