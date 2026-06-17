'use client'

import Image from 'next/image'
import {
  ArrowDownTrayIcon,
  ClipboardDocumentIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/24/outline'
import { formatFileSize, isImageMime } from '@/modules/media/constants'
import type { MediaItem } from '@/modules/media/types'
import { useMediaContext } from './MediaContext'

function MediaThumbnail({ item, className = '' }: { item: MediaItem; className?: string }) {
  const thumb = item.variants?.thumbnail ?? item.url
  if (isImageMime(item.mimeType)) {
    return (
      <Image
        src={thumb}
        alt=""
        fill
        className={`object-cover ${className}`}
        sizes="200px"
        unoptimized
      />
    )
  }
  if (item.mimeType.startsWith('video/')) {
    return (
      <div
        className={`flex h-full items-center justify-center bg-gray-900 text-xs text-white ${className}`}
      >
        MP4
      </div>
    )
  }
  if (item.mimeType === 'application/pdf') {
    return (
      <div
        className={`flex h-full items-center justify-center bg-red-50 text-xs font-bold text-red-600 ${className}`}
      >
        PDF
      </div>
    )
  }
  return (
    <div
      className={`flex h-full items-center justify-center bg-gray-100 text-xs text-gray-500 ${className}`}
    >
      FILE
    </div>
  )
}

interface MediaCardProps {
  item: MediaItem
  index: number
  onCopy: (url: string) => void
  onDelete: (id: string) => void
  onRename: (id: string) => void
  onMove: (id: string) => void
}

export function MediaCard({ item, index, onCopy, onDelete, onRename, onMove }: MediaCardProps) {
  const { isSelected, toggleSelect, setActiveItem, setPreviewItem } = useMediaContext()
  const selected = isSelected(item.id)

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border bg-white transition dark:bg-gray-950 ${
        selected
          ? 'border-brand-500 ring-brand-500/30 ring-2'
          : 'hover:border-brand-300 border-gray-200 dark:border-gray-800'
      }`}
    >
      <div
        role="button"
        tabIndex={0}
        className="relative aspect-square cursor-pointer bg-gray-100 dark:bg-gray-900"
        onClick={(e) => {
          if (e.shiftKey || e.metaKey || e.ctrlKey) {
            toggleSelect(item.id, index, e.shiftKey)
          } else {
            setActiveItem(item)
          }
        }}
        onDoubleClick={() => setPreviewItem(item)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setActiveItem(item)
          }
        }}
      >
        <MediaThumbnail item={item} />
        <div className="absolute top-2 left-2">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => {
              e.stopPropagation()
              toggleSelect(
                item.id,
                index,
                e.nativeEvent instanceof MouseEvent && e.nativeEvent.shiftKey
              )
            }}
            className="admin-checkbox"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-gray-900/60 opacity-0 transition group-hover:opacity-100">
          <button
            type="button"
            onClick={() => setPreviewItem(item)}
            className="rounded-lg bg-white/90 p-2 text-gray-800"
            title="Preview"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onCopy(item.url)}
            className="rounded-lg bg-white/90 p-2 text-gray-800"
            title="Copy URL"
          >
            <ClipboardDocumentIcon className="h-4 w-4" />
          </button>
          <a
            href={item.url}
            download
            className="rounded-lg bg-white/90 p-2 text-gray-800"
            title="Download"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={() => onRename(item.id)}
            className="rounded-lg bg-white/90 p-2 text-gray-800"
            title="Rename"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onMove(item.id)}
            className="rounded-lg bg-white/90 p-2 text-gray-800"
            title="Move"
          >
            <ArrowsRightLeftIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="bg-error-500 rounded-lg p-2 text-white"
            title="Delete"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="p-2.5">
        <p
          className="truncate text-xs font-medium text-gray-800 dark:text-gray-200"
          title={item.filename}
        >
          {item.filename}
        </p>
        <p className="text-[11px] text-gray-500">
          {formatFileSize(item.size)} · {new Date(item.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}

export { MediaThumbnail }
