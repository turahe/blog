'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth/session'
import { requirePermission, requireAnyPermission } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'
import { uploadFileToMinio, deleteObjectFromMinio, replaceFileInMinio } from '@/lib/storage/minio'
import { mediaFolderRepository, mediaRepository } from '../repositories'
import type { CrudActionResult } from '@/lib/crud/types'
import type { MediaItem, MediaListFilters, MediaPickerResult } from '../types'

function revalidateMedia() {
  revalidatePath('/admin/media')
}

export async function listMediaAction(
  params: {
    page?: number
    pageSize?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    filters?: MediaListFilters
  } = {}
): Promise<
  CrudActionResult<{ items: MediaItem[]; total: number; page: number; totalPages: number }>
> {
  await requireAnyPermission('media.view', 'media.upload')
  const result = await mediaRepository.findMany({
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 24,
    search: params.search,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
    filters: params.filters,
  })
  return {
    success: true,
    data: {
      items: result.data,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    },
  }
}

export async function uploadMediaAction(
  formData: FormData
): Promise<CrudActionResult<MediaPickerResult>> {
  await requirePermission('media.upload')
  const session = await getSession()

  const file = formData.get('file')
  const folderId = formData.get('folderId') ? String(formData.get('folderId')) : null
  const folderPathOverride = formData.get('folderPath') ? String(formData.get('folderPath')) : null

  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: 'No file provided' }
  }

  try {
    const folderPath = folderId
      ? await mediaFolderRepository.resolveStoragePath(folderId)
      : (folderPathOverride ?? 'media')
    const uploaded = await uploadFileToMinio(file, folderPath)
    const media = await mediaRepository.create({
      key: uploaded.key,
      url: uploaded.url,
      filename: uploaded.filename,
      originalName: uploaded.originalName,
      mimeType: uploaded.mimeType,
      extension: uploaded.extension,
      size: uploaded.size,
      width: uploaded.width,
      height: uploaded.height,
      folder: folderPath,
      variants: uploaded.variants,
      folderRef: folderId ? { connect: { id: folderId } } : undefined,
      uploadedBy: session?.user.id ? { connect: { id: session.user.id } } : undefined,
    })

    await logAudit({
      actorId: session?.user.id,
      entity: 'media',
      entityId: media.id,
      action: 'create',
      after: { key: media.key, url: media.url },
    })

    revalidateMedia()
    return {
      success: true,
      data: {
        id: media.id,
        url: media.url,
        filename: media.filename,
        altText: media.altText,
        width: media.width,
        height: media.height,
      },
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Upload failed' }
  }
}

export async function updateMediaAction(
  id: string,
  data: {
    filename?: string
    title?: string
    altText?: string
    caption?: string
    description?: string
    tags?: string[]
  }
): Promise<CrudActionResult<MediaItem>> {
  await requirePermission('media.upload')
  const session = await getSession()
  await mediaRepository.update(id, {
    filename: data.filename,
    title: data.title,
    altText: data.altText,
    alt: data.altText,
    caption: data.caption,
    description: data.description,
  })
  if (data.tags) await mediaRepository.setTags(id, data.tags)
  const updated = await mediaRepository.findById(id)
  if (!updated) return { success: false, error: 'Media not found' }

  await logAudit({
    actorId: session?.user.id,
    entity: 'media',
    entityId: id,
    action: 'update',
    after: data,
  })
  revalidateMedia()
  return { success: true, data: updated }
}

export async function deleteMediaAction(id: string): Promise<CrudActionResult> {
  await requirePermission('media.delete')
  const session = await getSession()
  const media = await mediaRepository.findById(id)
  if (!media) return { success: false, error: 'Media not found' }

  try {
    await deleteObjectFromMinio(media.key)
  } catch {
    /* gone */
  }

  await mediaRepository.delete(id)
  await logAudit({
    actorId: session?.user.id,
    entity: 'media',
    entityId: id,
    action: 'delete',
    before: { key: media.key },
  })
  revalidateMedia()
  return { success: true }
}

export async function bulkDeleteMediaAction(ids: string[]): Promise<CrudActionResult> {
  await requirePermission('media.delete')
  const session = await getSession()
  for (const id of ids) {
    const media = await mediaRepository.findById(id)
    if (media) {
      try {
        await deleteObjectFromMinio(media.key)
      } catch {
        /* */
      }
    }
  }
  await mediaRepository.bulkDelete(ids)
  await logAudit({
    actorId: session?.user.id,
    entity: 'media',
    action: 'bulk_delete',
    after: { ids },
  })
  revalidateMedia()
  return { success: true }
}

export async function moveMediaAction(
  ids: string[],
  folderId: string | null
): Promise<CrudActionResult> {
  await requirePermission('media.upload')
  const folderPath = await mediaFolderRepository.resolveStoragePath(folderId)
  await mediaRepository.bulkUpdateFolder(ids, folderId, folderPath)
  revalidateMedia()
  return { success: true }
}

export async function renameMediaAction(id: string, filename: string): Promise<CrudActionResult> {
  await requirePermission('media.upload')
  if (!filename.trim()) return { success: false, error: 'Filename required' }
  await mediaRepository.update(id, { filename: filename.trim() })
  revalidateMedia()
  return { success: true }
}

export async function replaceMediaFileAction(
  id: string,
  formData: FormData
): Promise<CrudActionResult> {
  await requirePermission('media.upload')
  const file = formData.get('file')
  if (!(file instanceof File)) return { success: false, error: 'No file' }
  const media = await mediaRepository.findById(id)
  if (!media) return { success: false, error: 'Not found' }
  const replaced = await replaceFileInMinio(media.key, file)
  const updated = await mediaRepository.update(id, {
    url: replaced.url,
    mimeType: replaced.mimeType,
    size: replaced.size,
    width: replaced.width,
    height: replaced.height,
    variants: replaced.variants,
  })
  revalidateMedia()
  return { success: true, data: updated }
}

export async function createMediaFolderAction(
  name: string,
  parentId?: string | null
): Promise<CrudActionResult<{ id: string }>> {
  await requirePermission('media.upload')
  if (!name.trim()) return { success: false, error: 'Folder name required' }
  const folder = await mediaFolderRepository.create(name.trim(), parentId ?? null)
  revalidateMedia()
  return { success: true, data: { id: folder.id } }
}

export async function renameMediaFolderAction(id: string, name: string): Promise<CrudActionResult> {
  await requirePermission('media.upload')
  await mediaFolderRepository.update(id, { name: name.trim() })
  revalidateMedia()
  return { success: true }
}

export async function deleteMediaFolderAction(id: string): Promise<CrudActionResult> {
  await requirePermission('media.delete')
  await mediaFolderRepository.delete(id)
  revalidateMedia()
  return { success: true }
}

export async function addMediaTagsAction(ids: string[], tags: string[]): Promise<CrudActionResult> {
  await requirePermission('media.upload')
  for (const id of ids) {
    await mediaRepository.setTags(id, tags)
  }
  revalidateMedia()
  return { success: true }
}

export async function getMediaDetailAction(id: string): Promise<CrudActionResult<MediaItem>> {
  await requireAnyPermission('media.view', 'media.upload')
  const media = await mediaRepository.findById(id)
  if (!media) return { success: false, error: 'Not found' }
  return { success: true, data: media }
}
