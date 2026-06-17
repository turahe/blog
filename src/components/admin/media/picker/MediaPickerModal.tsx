'use client'

import { useCallback, useEffect, useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import {
  deleteMediaAction,
  getMediaDetailAction,
  listMediaAction,
  updateMediaAction,
} from '@/modules/media/actions'
import type { MediaItem } from '@/modules/media/types'
import { MediaSearch } from './MediaSearch'
import { MediaPickerGrid } from './MediaPickerGrid'
import { MediaPickerSidebar } from './MediaPickerSidebar'
import { MediaUploadDropzone } from './MediaUploadDropzone'
import {
  type MediaPickerModalProps,
  type MediaPickerTab,
  type PickerSidebarDraft,
  toPickerResult,
} from './types'

export function MediaPickerModal({
  open,
  onClose,
  onSelect,
  title = 'Media Library',
  folderId = null,
  folderPath,
}: MediaPickerModalProps) {
  const [tab, setTab] = useState<MediaPickerTab>('library')
  const [items, setItems] = useState<MediaItem[]>([])
  const [selected, setSelected] = useState<MediaItem | null>(null)
  const [draft, setDraft] = useState<PickerSidebarDraft>({ altText: '', caption: '' })
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selecting, setSelecting] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2500)
  }

  const loadPage = useCallback(
    async (pageNum: number, append: boolean) => {
      setLoading(true)
      const result = await listMediaAction({
        page: pageNum,
        pageSize: 30,
        search: search || undefined,
        filters: { type: 'image', folderId: folderId ?? undefined },
      })
      setLoading(false)
      if (!result.success || !result.data) return
      setItems((prev) => (append ? [...prev, ...result.data!.items] : result.data!.items))
      setPage(result.data.page)
      setTotalPages(result.data.totalPages)
    },
    [search, folderId]
  )

  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => void loadPage(1, false), 250)
    return () => clearTimeout(t)
  }, [open, loadPage])

  useEffect(() => {
    if (!open) {
      setTab('library')
      setSelected(null)
      setSearch('')
      setDraft({ altText: '', caption: '' })
    }
  }, [open])

  const handleSelectItem = (item: MediaItem) => {
    setSelected(item)
    setDraft({
      altText: item.altText ?? '',
      caption: item.caption ?? '',
    })
  }

  const selectById = async (id: string) => {
    const result = await getMediaDetailAction(id)
    if (result.success && result.data) {
      handleSelectItem(result.data)
      setItems((prev) => {
        if (prev.some((i) => i.id === id)) return prev
        return [result.data!, ...prev]
      })
    }
  }

  const handleUploadComplete = async (uploadedIds: string[]) => {
    await loadPage(1, false)
    setTab('library')
    if (uploadedIds[0]) await selectById(uploadedIds[uploadedIds.length - 1]!)
    showToast('Upload complete')
  }

  const handleConfirmSelect = async () => {
    if (!selected) return
    setSelecting(true)
    const altChanged = draft.altText !== (selected.altText ?? '')
    const captionChanged = draft.caption !== (selected.caption ?? '')
    if (altChanged || captionChanged) {
      await updateMediaAction(selected.id, {
        altText: draft.altText,
        caption: draft.caption,
      })
    }
    setSelecting(false)
    onSelect(toPickerResult(selected, draft))
    onClose()
  }

  const handleCopyUrl = () => {
    if (!selected) return
    void navigator.clipboard.writeText(selected.url)
    showToast('URL copied')
  }

  const handleDelete = async () => {
    if (!selected || !confirm('Delete this image permanently?')) return
    const result = await deleteMediaAction(selected.id)
    if (!result.success) {
      showToast(result.error ?? 'Delete failed')
      return
    }
    setItems((prev) => prev.filter((i) => i.id !== selected.id))
    setSelected(null)
    showToast('Image deleted')
  }

  return (
    <Dialog open={open} onClose={onClose} className="relative z-[200]">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition data-closed:opacity-0"
      />
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4">
        <DialogPanel
          transition
          className="flex h-[85vh] w-[90vw] max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition data-closed:scale-95 data-closed:opacity-0 dark:bg-gray-950"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white/90">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
              aria-label="Close"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex shrink-0 gap-1 border-b border-gray-200 px-5 dark:border-gray-800">
            {(
              [
                { id: 'upload' as const, label: 'Upload' },
                { id: 'library' as const, label: 'Media Library' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`border-b-2 px-4 py-3 text-sm font-medium transition ${
                  tab === t.id
                    ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                    : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Body */}
          <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
            <div className="flex min-h-0 flex-1 flex-col p-5">
              {tab === 'library' ? (
                <>
                  <div className="mb-4 shrink-0">
                    <MediaSearch value={search} onChange={setSearch} />
                  </div>
                  <div className="min-h-0 flex-1">
                    <MediaPickerGrid
                      items={items}
                      selectedId={selected?.id ?? null}
                      onSelect={handleSelectItem}
                      loading={loading}
                      hasMore={page < totalPages}
                      onLoadMore={() => void loadPage(page + 1, true)}
                    />
                  </div>
                </>
              ) : (
                <MediaUploadDropzone
                  folderId={folderId}
                  folderPath={folderPath}
                  onUploadComplete={handleUploadComplete}
                />
              )}
            </div>

            <MediaPickerSidebar
              item={selected}
              draft={draft}
              onDraftChange={setDraft}
              onCopyUrl={handleCopyUrl}
              onDelete={handleDelete}
            />
          </div>

          {/* Footer */}
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-200 px-5 py-4 dark:border-gray-800">
            <button type="button" onClick={onClose} className="admin-btn-secondary">
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleConfirmSelect()}
              disabled={!selected || selecting}
              className="admin-btn-primary min-w-[8rem]"
            >
              {selecting ? 'Saving…' : 'Select image'}
            </button>
          </div>

          {toast && (
            <div className="pointer-events-none absolute bottom-20 left-1/2 -translate-x-1/2 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white shadow-lg">
              {toast}
            </div>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  )
}
