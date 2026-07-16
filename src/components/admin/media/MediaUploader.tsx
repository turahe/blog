'use client'

import { useRef } from 'react'
import { FilePondUpload } from '@/components/media/FilePondUpload'
import { useMediaContext } from './MediaContext'

interface MediaUploaderProps {
  folderId: string | null
  onComplete?: () => void
  openRef?: React.MutableRefObject<(() => void) | null>
}

export function MediaUploader({ folderId, onComplete, openRef }: MediaUploaderProps) {
  const { showToast } = useMediaContext()
  const browseRef = useRef<(() => void) | null>(null)

  if (openRef) {
    openRef.current = () => browseRef.current?.()
  }

  return (
    <FilePondUpload
      purpose="media"
      folderId={folderId}
      allowMultiple
      browseRef={browseRef}
      className="rounded-xl border border-dashed border-gray-200 p-3 dark:border-gray-800"
      onUploaded={() => {
        showToast('Upload complete')
        onComplete?.()
      }}
      onError={(message) => showToast(message, 'error')}
    />
  )
}
