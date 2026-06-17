export type MediaViewMode = 'grid' | 'list'

export type MediaTypeFilter = 'all' | 'image' | 'video' | 'document' | 'audio' | 'svg'

export type MediaVariants = {
  thumbnail: string
  small: string
  medium: string
  large: string
}

export type MediaTagItem = {
  id: string
  name: string
  slug: string
}

export type MediaFolderItem = {
  id: string
  name: string
  slug: string
  parentId: string | null
  path: string
  childCount: number
  mediaCount: number
}

export type MediaItem = {
  id: string
  key: string
  url: string
  filename: string
  originalName: string | null
  mimeType: string
  extension: string | null
  size: number
  width: number | null
  height: number | null
  altText: string | null
  title: string | null
  caption: string | null
  description: string | null
  folderId: string | null
  folderPath: string
  variants: MediaVariants | null
  uploadedBy: { id: string; fullName: string } | null
  tags: MediaTagItem[]
  createdAt: string
  updatedAt: string
}

export type MediaListFilters = {
  search?: string
  type?: MediaTypeFilter
  folderId?: string
  uploadedById?: string
  dateFrom?: string
  dateTo?: string
  mimeType?: string
}

export type UploadQueueItem = {
  id: string
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'done' | 'error' | 'cancelled'
  error?: string
}

export type MediaPickerResult = {
  id: string
  url: string
  filename: string
  altText: string | null
  caption?: string | null
  width: number | null
  height: number | null
}
