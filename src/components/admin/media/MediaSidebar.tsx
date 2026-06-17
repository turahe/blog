'use client'

import { useEffect, useState } from 'react'
import {
  XMarkIcon,
  ClipboardDocumentIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import { formatFileSize, isImageMime } from '@/modules/media/constants'
import {
  updateMediaAction,
  replaceMediaFileAction,
  deleteMediaAction,
} from '@/modules/media/actions'
import type { MediaItem } from '@/modules/media/types'
import { MediaThumbnail } from './MediaCard'
import { useMediaContext } from './MediaContext'

export function MediaSidebar({
  item,
  onClose,
  onUpdated,
  onDeleted,
}: {
  item: MediaItem | null
  onClose: () => void
  onUpdated: () => void
  onDeleted: () => void
}) {
  const { showToast } = useMediaContext()
  const [draft, setDraft] = useState({
    filename: '',
    title: '',
    altText: '',
    caption: '',
    description: '',
    tags: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!item) return
    setDraft({
      filename: item.filename,
      title: item.title ?? '',
      altText: item.altText ?? '',
      caption: item.caption ?? '',
      description: item.description ?? '',
      tags: item.tags.map((t) => t.name).join(', '),
    })
  }, [item])

  if (!item) return null

  const save = async () => {
    setSaving(true)
    const result = await updateMediaAction(item.id, {
      filename: draft.filename,
      title: draft.title,
      altText: draft.altText,
      caption: draft.caption,
      description: draft.description,
      tags: draft.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    })
    setSaving(false)
    showToast(
      result.success ? 'Saved' : (result.error ?? 'Error'),
      result.success ? 'success' : 'error'
    )
    if (result.success) onUpdated()
  }

  const copyUrl = () => {
    void navigator.clipboard.writeText(item.url)
    showToast('URL copied')
  }

  const handleReplace = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      const fd = new FormData()
      fd.append('file', file)
      const result = await replaceMediaFileAction(item.id, fd)
      showToast(
        result.success ? 'File replaced' : (result.error ?? 'Error'),
        result.success ? 'success' : 'error'
      )
      if (result.success) onUpdated()
    }
    input.click()
  }

  const handleDelete = async () => {
    if (!confirm('Delete this file permanently?')) return
    const result = await deleteMediaAction(item.id)
    showToast(
      result.success ? 'Deleted' : (result.error ?? 'Error'),
      result.success ? 'success' : 'error'
    )
    if (result.success) {
      onDeleted()
      onClose()
    }
  }

  return (
    <aside className="fixed top-0 right-0 z-40 flex h-full w-full max-w-md flex-col border-l border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <h3 className="font-semibold text-gray-900 dark:text-white/90">Attachment details</h3>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-5">
        <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-900">
          {isImageMime(item.mimeType) ? (
            <MediaThumbnail item={item} />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-500">
              {item.mimeType}
            </div>
          )}
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs text-gray-500">File size</dt>
            <dd className="font-medium">{formatFileSize(item.size)}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Dimensions</dt>
            <dd className="font-medium">
              {item.width && item.height ? `${item.width}×${item.height}` : '—'}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-xs text-gray-500">Uploaded</dt>
            <dd className="font-medium">{new Date(item.createdAt).toLocaleString()}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-xs text-gray-500">File URL</dt>
            <dd className="text-brand-600 truncate font-mono text-xs">{item.url}</dd>
          </div>
        </dl>

        <div className="space-y-4">
          <Field
            label="File name"
            value={draft.filename}
            onChange={(v) => setDraft((d) => ({ ...d, filename: v }))}
          />
          <Field
            label="Title"
            value={draft.title}
            onChange={(v) => setDraft((d) => ({ ...d, title: v }))}
          />
          <Field
            label="Alt text"
            value={draft.altText}
            onChange={(v) => setDraft((d) => ({ ...d, altText: v }))}
          />
          <Field
            label="Caption"
            value={draft.caption}
            onChange={(v) => setDraft((d) => ({ ...d, caption: v }))}
            multiline
          />
          <Field
            label="Description"
            value={draft.description}
            onChange={(v) => setDraft((d) => ({ ...d, description: v }))}
            multiline
          />
          <Field
            label="Tags"
            value={draft.tags}
            onChange={(v) => setDraft((d) => ({ ...d, tags: v }))}
            hint="Comma-separated"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-gray-200 p-5 dark:border-gray-800">
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving}
          className="admin-btn-primary"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button type="button" onClick={copyUrl} className="admin-btn-secondary">
          <ClipboardDocumentIcon className="h-4 w-4" />
          Copy URL
        </button>
        <a href={item.url} download className="admin-btn-secondary">
          <ArrowDownTrayIcon className="h-4 w-4" />
        </a>
        <button type="button" onClick={handleReplace} className="admin-btn-secondary">
          <ArrowPathIcon className="h-4 w-4" />
          Replace
        </button>
        <button type="button" onClick={() => void handleDelete()} className="admin-btn-danger">
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </aside>
  )
}

function Field({
  label,
  value,
  onChange,
  multiline,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  hint?: string
}) {
  return (
    <div className="admin-field">
      <label className="admin-label">{label}</label>
      {multiline ? (
        <textarea
          className="admin-textarea"
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input className="admin-input" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint && <p className="text-theme-xs text-gray-500">{hint}</p>}
    </div>
  )
}
