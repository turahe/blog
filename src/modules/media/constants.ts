export const MEDIA_VIEW_MODE_KEY = 'media-library-view-mode'

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
  'video/mp4',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const

export const MEDIA_TYPE_FILTERS = [
  { id: 'all', label: 'All Files' },
  { id: 'image', label: 'Images' },
  { id: 'video', label: 'Videos' },
  { id: 'document', label: 'Documents' },
  { id: 'audio', label: 'Audio' },
  { id: 'svg', label: 'SVG' },
] as const

export const MIME_FILTER_MAP: Record<string, string[] | undefined> = {
  all: undefined,
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'],
  video: ['video/mp4', 'video/webm', 'video/quicktime'],
  document: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  svg: ['image/svg+xml'],
}

export const MAX_FILE_BYTES = 25 * 1024 * 1024

export function getExtension(filename: string) {
  const parts = filename.split('.')
  return parts.length > 1 ? parts.pop()!.toLowerCase() : ''
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function isImageMime(mime: string) {
  return mime.startsWith('image/')
}

export function slugifyFolderName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
