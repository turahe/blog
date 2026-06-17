'use client'

import { useEffect } from 'react'
import { formatFileSize } from '@/modules/media/constants'
import { MediaThumbnail } from './MediaCard'
import { useMediaContext } from './MediaContext'
import type { MediaItem } from '@/modules/media/types'
import {
  ArrowDownTrayIcon,
  ClipboardDocumentIcon,
  EyeIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'

interface MediaTableProps {
  items: MediaItem[]
  sortBy: string
  sortOrder: 'asc' | 'desc'
  onSort: (column: string) => void
  onCopy: (url: string) => void
  onDelete: (id: string) => void
  onPreview: (item: MediaItem) => void
}

export function MediaTable({
  items,
  sortBy,
  sortOrder,
  onSort,
  onCopy,
  onDelete,
  onPreview,
}: MediaTableProps) {
  const { setItems, isSelected, toggleSelect, selectAll, clearSelection } = useMediaContext()

  useEffect(() => {
    setItems(items)
  }, [items, setItems])

  const allSelected = items.length > 0 && items.every((i) => isSelected(i.id))

  const SortHeader = ({ column, label }: { column: string; label: string }) => (
    <button
      type="button"
      onClick={() => onSort(column)}
      className="hover:text-brand-600 flex items-center gap-1 font-medium"
    >
      {label}
      {sortBy === column && <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
    </button>
  )

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
      <div className="max-h-[calc(100vh-20rem)] overflow-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="sticky top-0 z-10 bg-gray-50 text-xs text-gray-500 uppercase dark:bg-gray-900/95 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() =>
                    allSelected ? clearSelection() : selectAll(items.map((i) => i.id))
                  }
                  className="admin-checkbox"
                />
              </th>
              <th className="px-4 py-3">Preview</th>
              <th className="px-4 py-3">
                <SortHeader column="filename" label="File name" />
              </th>
              <th className="px-4 py-3">
                <SortHeader column="mimeType" label="Type" />
              </th>
              <th className="px-4 py-3">
                <SortHeader column="size" label="Size" />
              </th>
              <th className="px-4 py-3">Dimensions</th>
              <th className="px-4 py-3">Uploaded by</th>
              <th className="px-4 py-3">
                <SortHeader column="createdAt" label="Date" />
              </th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={item.id}
                className={`border-t border-gray-100 dark:border-gray-800 ${
                  isSelected(item.id) ? 'bg-brand-50/50 dark:bg-brand-500/5' : ''
                }`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={isSelected(item.id)}
                    onChange={(e) =>
                      toggleSelect(
                        item.id,
                        index,
                        e.nativeEvent instanceof MouseEvent && e.nativeEvent.shiftKey
                      )
                    }
                    className="admin-checkbox"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900">
                    <MediaThumbnail item={item} />
                  </div>
                </td>
                <td className="max-w-[200px] truncate px-4 py-3 font-medium text-gray-800 dark:text-gray-200">
                  {item.filename}
                </td>
                <td className="px-4 py-3 text-gray-500">{item.mimeType}</td>
                <td className="px-4 py-3 text-gray-500">{formatFileSize(item.size)}</td>
                <td className="px-4 py-3 text-gray-500">
                  {item.width && item.height ? `${item.width}×${item.height}` : '—'}
                </td>
                <td className="px-4 py-3 text-gray-500">{item.uploadedBy?.fullName ?? '—'}</td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => onPreview(item)}
                      className="rounded p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onCopy(item.url)}
                      className="rounded p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <ClipboardDocumentIcon className="h-4 w-4" />
                    </button>
                    <a
                      href={item.url}
                      download
                      className="rounded p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                    </a>
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      className="text-error-600 hover:bg-error-50 dark:hover:bg-error-500/10 rounded p-1.5"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
