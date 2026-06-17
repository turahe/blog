import type { MediaItem, MediaPickerResult } from '@/modules/media/types'

export type MediaPickerTab = 'library' | 'upload'

export type MediaPickerModalProps = {
  open: boolean
  onClose: () => void
  onSelect: (result: MediaPickerResult) => void
  title?: string
  folderId?: string | null
  folderPath?: string
}

export type PickerUploadItem = {
  id: string
  file: File
  previewUrl: string
  progress: number
  status: 'pending' | 'uploading' | 'done' | 'error'
  error?: string
  result?: MediaPickerResult
}

export type PickerSidebarDraft = {
  altText: string
  caption: string
}

export function toPickerResult(item: MediaItem, draft?: PickerSidebarDraft): MediaPickerResult {
  return {
    id: item.id,
    url: item.url,
    filename: item.filename,
    altText: draft?.altText ?? item.altText,
    caption: draft?.caption ?? item.caption,
    width: item.width,
    height: item.height,
  }
}

export const PICKER_IMAGE_ACCEPT = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
].join(',')

export const PICKER_MAX_BYTES = 10 * 1024 * 1024
