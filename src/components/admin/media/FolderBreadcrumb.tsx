'use client'

import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline'

interface BreadcrumbSegment {
  id: string | null
  name: string
}

export function FolderBreadcrumb({
  segments,
  onNavigate,
}: {
  segments: BreadcrumbSegment[]
  onNavigate: (folderId: string | null) => void
}) {
  return (
    <nav className="flex flex-wrap items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
      <button
        type="button"
        onClick={() => onNavigate(null)}
        className="inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-white/5 dark:hover:text-gray-200"
      >
        <HomeIcon className="h-4 w-4" />
        Media Library
      </button>
      {segments.map((seg) => (
        <span key={seg.id ?? 'root'} className="inline-flex items-center gap-1">
          <ChevronRightIcon className="h-4 w-4 text-gray-400" />
          <button
            type="button"
            onClick={() => onNavigate(seg.id)}
            className="rounded-md px-2 py-1 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-white/5 dark:hover:text-gray-200"
          >
            {seg.name}
          </button>
        </span>
      ))}
    </nav>
  )
}
