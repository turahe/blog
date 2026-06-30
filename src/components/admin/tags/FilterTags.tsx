'use client'

import { useMemo, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { AdminTag } from './AdminTag'
import { FILTER_EXCLUDED_PARAMS, FILTER_PARAM_LABELS } from './semantic'
import type { FilterTagItem } from './types'

interface FilterTagsProps {
  className?: string
  sticky?: boolean
}

export function FilterTags({ className, sticky = true }: FilterTagsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const filters = useMemo(() => {
    const items: FilterTagItem[] = []
    searchParams.forEach((value, key) => {
      if (FILTER_EXCLUDED_PARAMS.has(key) || !value) return
      const label = FILTER_PARAM_LABELS[key] ?? key
      items.push({ key, label, value })
    })
    return items
  }, [searchParams])

  if (filters.length === 0) return null

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null) params.delete(k)
      else params.set(k, v)
    })
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const removeFilter = (key: string) => {
    updateParams({ [key]: null, page: '1' })
  }

  const clearAll = () => {
    const updates: Record<string, string | null> = { page: '1' }
    filters.forEach((f) => {
      updates[f.key] = null
    })
    updateParams(updates)
  }

  return (
    <div
      className={`flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/90 px-3 py-2 dark:border-gray-800 dark:bg-gray-900/60 ${
        sticky ? 'sticky top-0 z-10 backdrop-blur-sm' : ''
      } ${isPending ? 'opacity-60' : ''} ${className ?? ''}`}
      role="region"
      aria-label={`${filters.length} active filters`}
    >
      <span className="text-theme-xs font-medium text-gray-500 dark:text-gray-400">
        Filters ({filters.length})
      </span>

      {filters.map((filter) => (
        <AdminTag
          key={filter.key}
          label={`${filter.label}: ${filter.value}`}
          variant="metadata"
          tone="info"
          size="sm"
          removable
          interactive
          onRemove={() => removeFilter(filter.key)}
        />
      ))}

      <button
        type="button"
        onClick={clearAll}
        className="text-theme-xs focus-visible:ring-brand-500 ml-auto font-medium text-gray-600 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 dark:text-gray-300"
      >
        Clear all
      </button>
    </div>
  )
}
