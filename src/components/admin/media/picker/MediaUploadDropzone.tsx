'use client'

import { useRef } from 'react'
import { FilePondUpload } from '@/components/media/FilePondUpload'

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
  const uploadedIds = useRef<string[]>([])

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-1">
      <FilePondUpload
        purpose="media"
        folderId={folderId}
        folderPath={folderPath}
        allowMultiple
        className="min-h-[280px]"
        onUploaded={(result) => {
          uploadedIds.current.push(result.id)
          onUploadComplete([...uploadedIds.current])
        }}
      />
    </div>
  )
}
