'use client'

import { useCallback, useRef, useState } from 'react'
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { uploadMediaAction } from '@/modules/media/actions'
import { formatFileSize } from '@/modules/media/constants'
import { PICKER_IMAGE_ACCEPT, PICKER_MAX_BYTES, type PickerUploadItem } from './types'

interface MediaUploadDropzoneProps {
  folderId?: string | null
  folderPath?: string
  onUploadComplete: (uploadedIds: string[]) => void
}

export function MediaUploadDropzone({
  folderId,
  folderPath,
  onUploadComplete,
}: MediaUploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [queue, setQueue] = useState<PickerUploadItem[]>([])

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files).filter((f) => {
        if (!PICKER_IMAGE_ACCEPT.split(',').includes(f.type)) return false
        if (f.size > PICKER_MAX_BYTES) return false
        return true
      })

      const items: PickerUploadItem[] = list.map((file) => ({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
        progress: 0,
        status: 'pending',
      }))
      setQueue((prev) => [...prev, ...items])

      const uploadedIds: string[] = []

      for (const item of items) {
        setQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, status: 'uploading', progress: 40 } : q))
        )
        const formData = new FormData()
        formData.append('file', item.file)
        if (folderId) formData.append('folderId', folderId)
        if (folderPath) formData.append('folderPath', folderPath)
        const result = await uploadMediaAction(formData)
        if (result.success && result.data) {
          uploadedIds.push(result.data.id)
          setQueue((prev) =>
            prev.map((q) =>
              q.id === item.id ? { ...q, status: 'done', progress: 100, result: result.data } : q
            )
          )
          // Revoke preview after upload completes
          URL.revokeObjectURL(item.previewUrl)
        } else {
          setQueue((prev) =>
            prev.map((q) =>
              q.id === item.id
                ? { ...q, status: 'error', error: result.error ?? 'Upload failed' }
                : q
            )
          )
        }
      }

      if (uploadedIds.length) onUploadComplete(uploadedIds)
    },
    [folderId, folderPath, onUploadComplete]
  )

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-1">
      <div
        className={`flex min-h-[280px] flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition ${
          dragOver
            ? 'border-brand-400 bg-brand-50/60 dark:bg-brand-500/10'
            : 'border-gray-300 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-900/30'
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          void processFiles(e.dataTransfer.files)
        }}
      >
        <ArrowUpTrayIcon className="h-12 w-12 text-gray-400" />
        <p className="mt-4 text-base font-medium text-gray-800 dark:text-gray-200">
          Drop images here or click to upload
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          JPG, PNG, WebP, SVG, GIF · Max 10 MB each
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="admin-btn-primary mt-6"
        >
          Select files
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={PICKER_IMAGE_ACCEPT}
          className="hidden"
          onChange={(e) => {
            if (e.target.files) void processFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      {queue.length > 0 && (
        <ul className="space-y-2 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-950">
          {queue.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-lg bg-gray-50 p-2 dark:bg-gray-900/50"
            >
              <img src={item.previewUrl} alt="" className="h-12 w-12 rounded object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                  {item.file.name}
                </p>
                <p className="text-xs text-gray-500">{formatFileSize(item.file.size)}</p>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                  <div
                    className={`h-full transition-all ${
                      item.status === 'error'
                        ? 'bg-error-500'
                        : item.status === 'done'
                          ? 'bg-success-500'
                          : 'bg-brand-500'
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <p className="mt-0.5 text-[11px] text-gray-500 capitalize">{item.status}</p>
                {item.error && <p className="text-error-600 text-[11px]">{item.error}</p>}
              </div>
              {item.status === 'done' && (
                <button
                  type="button"
                  onClick={() => setQueue((q) => q.filter((x) => x.id !== item.id))}
                >
                  <XMarkIcon className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
