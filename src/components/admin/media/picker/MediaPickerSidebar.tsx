'use client'

import { ClipboardDocumentIcon, TrashIcon } from '@heroicons/react/24/outline'
import { formatFileSize } from '@/modules/media/constants'
import type { MediaItem } from '@/modules/media/types'
import type { PickerSidebarDraft } from './types'
import { MediaPreview } from './MediaPreview'

interface MediaPickerSidebarProps {
  item: MediaItem | null
  draft: PickerSidebarDraft
  onDraftChange: (draft: PickerSidebarDraft) => void
  onCopyUrl: () => void
  onDelete: () => void
}

export function MediaPickerSidebar({
  item,
  draft,
  onDraftChange,
  onCopyUrl,
  onDelete,
}: MediaPickerSidebarProps) {
  if (!item) {
    return (
      <aside className="flex w-full shrink-0 flex-col border-l border-gray-200 bg-gray-50/50 p-5 lg:w-72 dark:border-gray-800 dark:bg-gray-900/30">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Select an image to view details and edit alt text.
        </p>
      </aside>
    )
  }

  return (
    <aside className="flex w-full shrink-0 flex-col border-l border-gray-200 bg-gray-50/50 lg:w-72 dark:border-gray-800 dark:bg-gray-900/30">
      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        <MediaPreview item={item} />

        <dl className="space-y-2 text-sm">
          <div>
            <dt className="text-xs font-medium text-gray-500 uppercase">File name</dt>
            <dd className="mt-0.5 truncate font-medium text-gray-800 dark:text-gray-200">
              {item.filename}
            </dd>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase">Dimensions</dt>
              <dd className="mt-0.5 text-gray-700 dark:text-gray-300">
                {item.width && item.height ? `${item.width} × ${item.height}` : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase">Size</dt>
              <dd className="mt-0.5 text-gray-700 dark:text-gray-300">
                {formatFileSize(item.size)}
              </dd>
            </div>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500 uppercase">Uploaded</dt>
            <dd className="mt-0.5 text-gray-700 dark:text-gray-300">
              {new Date(item.createdAt).toLocaleDateString()}
            </dd>
          </div>
        </dl>

        <div className="space-y-3">
          <div className="admin-field">
            <label htmlFor="media-picker-alt-text" className="admin-label">
              Alt text
            </label>
            <input
              id="media-picker-alt-text"
              className="admin-input text-sm"
              value={draft.altText}
              onChange={(e) => onDraftChange({ ...draft, altText: e.target.value })}
              placeholder="Describe this image"
            />
          </div>
          <div className="admin-field">
            <label htmlFor="media-picker-caption" className="admin-label">
              Caption
            </label>
            <textarea
              id="media-picker-caption"
              className="admin-textarea text-sm"
              rows={2}
              value={draft.caption}
              onChange={(e) => onDraftChange({ ...draft, caption: e.target.value })}
              placeholder="Optional caption"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-t border-gray-200 p-4 dark:border-gray-800">
        <button type="button" onClick={onCopyUrl} className="admin-btn-secondary flex-1 text-xs">
          <ClipboardDocumentIcon className="h-4 w-4" />
          Copy URL
        </button>
        <button type="button" onClick={onDelete} className="admin-btn-danger text-xs">
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </aside>
  )
}
