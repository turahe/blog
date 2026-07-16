import { revalidatePath } from 'next/cache'
import { logAudit } from '@/lib/audit'
import { uploadFileToMinio, deleteObjectFromMinio } from '@/lib/storage/minio'
import { AVATAR_MAX_BYTES, MAX_FILE_BYTES, isAllowedAvatarMime } from '@/modules/media/constants'
import { isBlockedExecutable } from '@/modules/media/executable-policy'
import { mediaFolderRepository, mediaRepository } from '@/modules/media/repositories'

export type UploadPurpose = 'media' | 'avatar'

export type ProcessMediaUploadInput = {
  file: File
  folderId?: string | null
  folderPath?: string | null
  purpose: UploadPurpose
  actorId?: string
}

export type ProcessMediaUploadResult = {
  id: string
  url: string
  filename: string
  altText: string | null
  width: number | null
  height: number | null
}

function revalidateMedia() {
  revalidatePath('/admin/media')
}

export async function processMediaUpload(
  input: ProcessMediaUploadInput
): Promise<ProcessMediaUploadResult> {
  const { file, purpose, actorId } = input

  if (!(file instanceof File) || file.size === 0) {
    throw new Error('No file provided')
  }

  if (isBlockedExecutable(file.name, file.type)) {
    throw new Error('Executable files are not allowed')
  }

  if (purpose === 'avatar') {
    if (!isAllowedAvatarMime(file.type)) {
      throw new Error('Avatar must be JPEG, PNG, WebP, or GIF')
    }
    if (file.size > AVATAR_MAX_BYTES) {
      throw new Error('Avatar must be 5MB or smaller')
    }
  } else if (file.size > MAX_FILE_BYTES) {
    throw new Error('File must be 25MB or smaller')
  }

  const folderPath =
    purpose === 'avatar'
      ? 'avatars'
      : input.folderId
        ? await mediaFolderRepository.resolveStoragePath(input.folderId)
        : (input.folderPath ?? 'media')

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
    folderRef:
      purpose !== 'avatar' && input.folderId
        ? { connect: { id: input.folderId } }
        : undefined,
    uploadedBy: actorId ? { connect: { id: actorId } } : undefined,
  })

  await logAudit({
    actorId,
    entity: 'media',
    entityId: media.id,
    action: 'create',
    after: { key: media.key, url: media.url, purpose },
  })

  revalidateMedia()

  return {
    id: media.id,
    url: media.url,
    filename: media.filename,
    altText: media.altText,
    width: media.width,
    height: media.height,
  }
}

export async function revertMediaUpload(mediaId: string, actorId?: string) {
  const media = await mediaRepository.findById(mediaId)
  if (!media) return

  try {
    await deleteObjectFromMinio(media.key)
  } catch {
    /* gone */
  }

  await mediaRepository.delete(mediaId)
  await logAudit({
    actorId,
    entity: 'media',
    entityId: mediaId,
    action: 'delete',
    before: { key: media.key, reason: 'filepond-revert' },
  })
  revalidateMedia()
}
