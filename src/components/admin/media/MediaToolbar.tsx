'use client'

import {
  ArrowUpTrayIcon,
  ArrowPathIcon,
  FolderPlusIcon,
  Squares2X2Icon,
  ListBulletIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { MEDIA_TYPE_FILTERS } from '@/modules/media/constants'
import type { MediaTypeFilter, MediaViewMode } from '@/modules/media/types'
import { useMediaContext } from './MediaContext'

interface MediaToolbarProps {
  search: string
  onSearchChange: (v: string) => void
  typeFilter: MediaTypeFilter
  onTypeFilterChange: (v: MediaTypeFilter) => void
  onUpload: () => void
  onCreateFolder: () => void
  onRefresh: () => void
  authorFilter: string
  onAuthorFilterChange: (v: string) => void
  authors: { id: string; fullName: string }[]
  dateFilter: string
  onDateFilterChange: (v: string) => void
}

export function MediaToolbar({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  onUpload,
  onCreateFolder,
  onRefresh,
  authorFilter,
  onAuthorFilterChange,
  authors,
  dateFilter,
  onDateFilterChange,
}: MediaToolbarProps) {
  const { viewMode, setViewMode, selectedIds, clearSelection } = useMediaContext()

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={onUpload} className="admin-btn-primary">
          <ArrowUpTrayIcon className="h-4 w-4" />
          Upload files
        </button>
        <button type="button" onClick={onCreateFolder} className="admin-btn-secondary">
          <FolderPlusIcon className="h-4 w-4" />
          New folder
        </button>
        <button type="button" onClick={onRefresh} className="admin-btn-secondary" title="Refresh">
          <ArrowPathIcon className="h-4 w-4" />
        </button>
        <div className="relative min-w-[200px] flex-1">
          <MagnifyingGlassIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search media…"
            className="admin-input !pl-9"
          />
        </div>
        <div className="flex rounded-lg border border-gray-200 p-0.5 dark:border-gray-700">
          <ViewButton
            mode="grid"
            current={viewMode}
            onClick={setViewMode}
            icon={Squares2X2Icon}
            label="Grid"
          />
          <ViewButton
            mode="list"
            current={viewMode}
            onClick={setViewMode}
            icon={ListBulletIcon}
            label="List"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {MEDIA_TYPE_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => onTypeFilterChange(f.id as MediaTypeFilter)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              typeFilter === f.id
                ? 'bg-brand-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            {f.label}
          </button>
        ))}
        <select
          value={authorFilter}
          onChange={(e) => onAuthorFilterChange(e.target.value)}
          className="admin-select !w-auto text-xs"
        >
          <option value="">All authors</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.fullName}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => onDateFilterChange(e.target.value)}
          className="admin-input !w-auto text-xs"
          title="Upload date"
        />
        {selectedIds.size > 0 && (
          <button
            type="button"
            onClick={clearSelection}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            {selectedIds.size} selected · Clear
          </button>
        )}
      </div>
    </div>
  )
}

function ViewButton({
  mode,
  current,
  onClick,
  icon: Icon,
  label,
}: {
  mode: MediaViewMode
  current: MediaViewMode
  onClick: (m: MediaViewMode) => void
  icon: React.ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(mode)}
      title={label}
      className={`rounded-md p-2 ${current === mode ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/10' : 'text-gray-500'}`}
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}
