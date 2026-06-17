'use client'

import { useState } from 'react'
import { uploadMediaAction } from '@/modules/media/actions'
import type { UploadQueueItem } from '@/modules/media/types'
import { ALLOWED_MIME_TYPES } from '@/modules/media/constants'
import { useMediaContext } from './MediaContext'
import { UploadQueue } from './UploadQueue'

interface MediaUploaderProps {
  folderId: string | null
  onComplete?: () => void
  openRef?: React.MutableRefObject<(() => void) | null>
}

export function MediaUploader({ folderId, onComplete, openRef }: MediaUploaderProps) {
  const { showToast } = useMediaContext()
  const [queue, setQueue] = useState<UploadQueueItem[]>([])
  const [dragOver, setDragOver] = useState(false)

  const processQueue = async (files: File[]) => {
    const items: UploadQueueItem[] = files.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
      progress: 0,
      status: 'pending',
    }))
    setQueue((prev) => [...prev, ...items])

    for (const item of items) {
      setQueue((prev) =>
        prev.map((q) => (q.id === item.id ? { ...q, status: 'uploading', progress: 30 } : q))
      )
      const formData = new FormData()
      formData.append('file', item.file)
      if (folderId) formData.append('folderId', folderId)
      const result = await uploadMediaAction(formData)
      if (result.success) {
        setQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, status: 'done', progress: 100 } : q))
        )
      } else {
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id ? { ...q, status: 'error', error: result.error, progress: 0 } : q
          )
        )
      }
    }
    showToast('Upload complete')
    onComplete?.()
  }

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList?.length) return
    void processQueue(Array.from(fileList))
  }

  const openPicker = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = ALLOWED_MIME_TYPES.join(',')
    input.onchange = () => handleFiles(input.files)
    input.click()
  }

  if (openRef) openRef.current = openPicker

  const retry = (id: string) => {
    const item = queue.find((q) => q.id === id)
    if (item) void processQueue([item.file])
  }

  const cancel = (id: string) => {
    setQueue((prev) => prev.map((q) => (q.id === id ? { ...q, status: 'cancelled' } : q)))
  }

  return (
    <>
      <div
        className={`rounded-xl border-2 border-dashed p-6 text-center transition ${
          dragOver ? 'border-brand-400 bg-brand-50/50 dark:bg-brand-500/5' : 'border-transparent'
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          handleFiles(e.dataTransfer.files)
        }}
      >
        {dragOver && (
          <p className="text-brand-600 dark:text-brand-400 text-sm font-medium">
            Drop files to upload
          </p>
        )}
      </div>
      <UploadQueue items={queue} onRetry={retry} onCancel={cancel} onDismiss={() => setQueue([])} />
    </>
  )
}
