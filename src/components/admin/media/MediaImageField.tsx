'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { PhotoIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { MediaPickerModal } from '@/components/admin/media/picker'
import type { MediaPickerResult } from '@/modules/media/types'

interface MediaImageFieldProps {
  label: string
  value: string
  onChange: (url: string) => void
  onMediaSelect?: (media: MediaPickerResult) => void
  folder?: string | null
  folderPath?: string
  placeholder?: string
  selectLabel?: string
  modalTitle?: string
}

export function MediaImageField({
  label,
  value,
  onChange,
  onMediaSelect,
  folder = null,
  folderPath,
  placeholder = 'Select or paste image URL',
  selectLabel = 'Select image',
  modalTitle = 'Media Library',
}: MediaImageFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false)

  const handleSelect = (result: MediaPickerResult) => {
    onChange(result.url)
    onMediaSelect?.(result)
  }

  return (
    <div className="admin-field">
      <label className="admin-label">{label}</label>
      <div className="space-y-3">
        {/* WordPress-style featured image card */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/40">
          {value ? (
            <div className="relative aspect-video w-full max-w-md bg-gray-100 dark:bg-gray-900">
              <Image src={value} alt="" fill className="object-cover" sizes="400px" unoptimized />
            </div>
          ) : (
            <div className="flex aspect-video max-w-md flex-col items-center justify-center gap-2 p-6 text-center">
              <PhotoIcon className="h-10 w-10 text-gray-400" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No image selected</p>
            </div>
          )}
          <div className="flex flex-wrap gap-2 border-t border-gray-200 p-3 dark:border-gray-800">
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="admin-btn-secondary text-sm"
            >
              <PencilSquareIcon className="h-4 w-4" />
              {value ? 'Replace image' : selectLabel}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="admin-btn-secondary text-sm"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="admin-input"
          placeholder={placeholder}
        />
      </div>

      {pickerOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <MediaPickerModal
            open={pickerOpen}
            onClose={() => setPickerOpen(false)}
            onSelect={handleSelect}
            title={modalTitle}
            folderId={null}
            folderPath={folderPath ?? folder ?? undefined}
          />,
          document.body
        )}
    </div>
  )
}

/**
 * Example: Featured image integration in a post editor.
 *
 * ```tsx
 * const [featured, setFeatured] = useState<MediaPickerResult | null>(null)
 *
 * <MediaImageField
 *   label="Featured image"
 *   value={featured?.url ?? ''}
 *   onChange={(url) => setFeatured((f) => (f ? { ...f, url } : null))}
 *   onMediaSelect={setFeatured}
 *   selectLabel="Select featured image"
 *   modalTitle="Featured Image"
 * />
 * ```
 */
