'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  bulkDeleteMediaAction,
  createMediaFolderAction,
  deleteMediaAction,
  listMediaAction,
  moveMediaAction,
  renameMediaAction,
  addMediaTagsAction,
} from '@/modules/media/actions'
import type { MediaFolderItem, MediaItem, MediaTypeFilter } from '@/modules/media/types'
import { MediaProvider, useMediaContext } from './MediaContext'
import { MediaToolbar } from './MediaToolbar'
import { FolderBreadcrumb } from './FolderBreadcrumb'
import { MediaGrid } from './MediaGrid'
import { MediaTable } from './MediaTable'
import { MediaUploader } from './MediaUploader'
import { MediaSidebar } from './MediaSidebar'
import { MediaPreviewModal } from './MediaPreviewModal'
import { ConfirmDialog } from '@/components/admin/settings/ConfirmDialog'

interface MediaLibraryAppProps {
  initialItems: MediaItem[]
  initialTotal: number
  folders: MediaFolderItem[]
  authors: { id: string; fullName: string }[]
  initialFolderId: string | null
  breadcrumb: { id: string | null; name: string }[]
}

function BulkBar({
  onDelete,
  onMove,
  onCopyUrls,
  onAddTags,
}: {
  onDelete: () => void
  onMove: () => void
  onCopyUrls: () => void
  onAddTags: () => void
}) {
  const { selectedIds } = useMediaContext()
  if (!selectedIds.size) return null
  return (
    <div className="border-brand-200 bg-brand-50 dark:border-brand-500/30 dark:bg-brand-500/10 sticky top-0 z-20 flex flex-wrap items-center gap-2 rounded-xl border px-4 py-3">
      <span className="text-brand-700 dark:text-brand-300 text-sm font-medium">
        {selectedIds.size} item{selectedIds.size > 1 ? 's' : ''} selected
      </span>
      <button type="button" onClick={onCopyUrls} className="admin-btn-secondary text-xs">
        Copy URLs
      </button>
      <button type="button" onClick={onAddTags} className="admin-btn-secondary text-xs">
        Add tags
      </button>
      <button type="button" onClick={onMove} className="admin-btn-secondary text-xs">
        Move
      </button>
      <button type="button" onClick={onDelete} className="admin-btn-danger text-xs">
        Delete
      </button>
    </div>
  )
}

function MediaLibraryInner({
  initialItems,
  initialTotal,
  folders,
  authors,
  initialFolderId,
  breadcrumb,
}: MediaLibraryAppProps) {
  const {
    viewMode,
    activeItem,
    setActiveItem,
    previewItem,
    setPreviewItem,
    selectedIds,
    clearSelection,
    showToast,
  } = useMediaContext()

  const [items, setItems] = useState(initialItems)
  const [total, setTotal] = useState(initialTotal)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<MediaTypeFilter>('all')
  const [folderId, setFolderId] = useState<string | null>(initialFolderId)
  const [crumbs, setCrumbs] = useState(breadcrumb)
  const [authorFilter, setAuthorFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [confirmDelete, setConfirmDelete] = useState<string[] | null>(null)
  const uploadRef = useRef<(() => void) | null>(null)

  const totalPages = Math.ceil(total / 24)

  const fetchMedia = useCallback(
    async (nextPage: number, append = false) => {
      setLoading(true)
      const result = await listMediaAction({
        page: nextPage,
        pageSize: 24,
        search: search || undefined,
        sortBy,
        sortOrder,
        filters: {
          type: typeFilter,
          folderId: folderId ?? undefined,
          uploadedById: authorFilter || undefined,
          dateFrom: dateFilter || undefined,
        },
      })
      setLoading(false)
      if (result.success && result.data) {
        setItems((prev) => (append ? [...prev, ...result.data!.items] : result.data!.items))
        setTotal(result.data.total)
        setPage(result.data.page)
      }
    },
    [search, sortBy, sortOrder, typeFilter, folderId, authorFilter, dateFilter]
  )

  useEffect(() => {
    const t = setTimeout(() => {
      void fetchMedia(1, false)
    }, 300)
    return () => clearTimeout(t)
  }, [fetchMedia])

  const refresh = () => void fetchMedia(1, false)

  const copyUrl = (url: string) => {
    void navigator.clipboard.writeText(url)
    showToast('URL copied to clipboard')
  }

  const handleDelete = (id: string) => setConfirmDelete([id])

  const handleBulkDelete = () => setConfirmDelete(Array.from(selectedIds))

  const confirmDeleteAction = async () => {
    if (!confirmDelete?.length) return
    const result =
      confirmDelete.length === 1
        ? await deleteMediaAction(confirmDelete[0]!)
        : await bulkDeleteMediaAction(confirmDelete)
    setConfirmDelete(null)
    clearSelection()
    showToast(
      result.success ? 'Deleted' : (result.error ?? 'Error'),
      result.success ? 'success' : 'error'
    )
    if (result.success) refresh()
  }

  const handleRename = async (id: string) => {
    const name = prompt('New file name:')
    if (!name) return
    const result = await renameMediaAction(id, name)
    showToast(
      result.success ? 'Renamed' : (result.error ?? 'Error'),
      result.success ? 'success' : 'error'
    )
    if (result.success) refresh()
  }

  const handleMove = async (id: string) => {
    const target = prompt('Folder ID to move to (leave empty for root):', folderId ?? '')
    const result = await moveMediaAction([id], target || null)
    showToast(
      result.success ? 'Moved' : (result.error ?? 'Error'),
      result.success ? 'success' : 'error'
    )
    if (result.success) refresh()
  }

  const handleBulkMove = async () => {
    const target = prompt('Folder ID (empty = root):', folderId ?? '')
    const result = await moveMediaAction(Array.from(selectedIds), target || null)
    showToast(
      result.success ? 'Moved' : (result.error ?? 'Error'),
      result.success ? 'success' : 'error'
    )
    if (result.success) {
      clearSelection()
      refresh()
    }
  }

  const handleBulkCopy = () => {
    const urls = items.filter((i) => selectedIds.has(i.id)).map((i) => i.url)
    void navigator.clipboard.writeText(urls.join('\n'))
    showToast(`${urls.length} URLs copied`)
  }

  const handleBulkTags = async () => {
    const tags = prompt('Tags (comma-separated):')
    if (!tags) return
    const result = await addMediaTagsAction(
      Array.from(selectedIds),
      tags.split(',').map((t) => t.trim())
    )
    showToast(
      result.success ? 'Tags added' : (result.error ?? 'Error'),
      result.success ? 'success' : 'error'
    )
    if (result.success) refresh()
  }

  const handleCreateFolder = async () => {
    const name = prompt('Folder name:')
    if (!name) return
    const result = await createMediaFolderAction(name, folderId)
    showToast(
      result.success ? 'Folder created' : (result.error ?? 'Error'),
      result.success ? 'success' : 'error'
    )
    if (result.success) refresh()
  }

  const navigateFolder = (id: string | null) => {
    setFolderId(id)
    if (!id) {
      setCrumbs([])
    } else {
      const folder = folders.find((f) => f.id === id)
      if (folder) {
        const parts = folder.path
          .replace(/^media\/?/, '')
          .split('/')
          .filter(Boolean)
        setCrumbs(parts.map((name, idx) => ({ id: idx === parts.length - 1 ? id : null, name })))
      }
    }
    clearSelection()
  }

  const handleSort = (column: string) => {
    if (sortBy === column) setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))
    else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  return (
    <div className="space-y-4">
      <FolderBreadcrumb segments={crumbs} onNavigate={navigateFolder} />

      <MediaToolbar
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        onUpload={() => uploadRef.current?.()}
        onCreateFolder={handleCreateFolder}
        onRefresh={refresh}
        authorFilter={authorFilter}
        onAuthorFilterChange={setAuthorFilter}
        authors={authors}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
      />

      <BulkBar
        onDelete={handleBulkDelete}
        onMove={handleBulkMove}
        onCopyUrls={handleBulkCopy}
        onAddTags={handleBulkTags}
      />

      <MediaUploader folderId={folderId} onComplete={refresh} openRef={uploadRef} />

      {viewMode === 'grid' ? (
        <MediaGrid
          items={items}
          loading={loading}
          hasMore={page < totalPages}
          onLoadMore={() => void fetchMedia(page + 1, true)}
          onCopy={copyUrl}
          onDelete={handleDelete}
          onRename={handleRename}
          onMove={handleMove}
          onUpload={() => uploadRef.current?.()}
        />
      ) : (
        <MediaTable
          items={items}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onCopy={copyUrl}
          onDelete={handleDelete}
          onPreview={setPreviewItem}
        />
      )}

      {viewMode === 'list' && totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Page {page} of {totalPages} · {total} files
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => void fetchMedia(page - 1)}
              className="admin-btn-secondary"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => void fetchMedia(page + 1)}
              className="admin-btn-secondary"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <MediaSidebar
        item={activeItem}
        onClose={() => setActiveItem(null)}
        onUpdated={refresh}
        onDeleted={refresh}
      />

      <MediaPreviewModal
        item={previewItem}
        items={items}
        onClose={() => setPreviewItem(null)}
        onNavigate={setPreviewItem}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete media?"
        message={`Permanently delete ${confirmDelete?.length ?? 0} file(s)? This cannot be undone.`}
        confirmLabel="Delete"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => void confirmDeleteAction()}
      />
    </div>
  )
}

export function MediaLibraryApp(props: MediaLibraryAppProps) {
  return (
    <MediaProvider>
      <MediaLibraryInner {...props} />
    </MediaProvider>
  )
}
