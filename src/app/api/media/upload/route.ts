import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { can } from '@/lib/rbac'
import { isAllowedAvatarMime } from '@/modules/media/constants'
import { isBlockedExecutable } from '@/modules/media/executable-policy'
import {
  processMediaUpload,
  revertMediaUpload,
  type UploadPurpose,
} from '@/modules/media/services/upload'

function getUploadFile(formData: FormData): File | null {
  const candidates = ['filepond', 'file', 'files']
  for (const key of candidates) {
    const value = formData.get(key)
    if (value instanceof File && value.size > 0) return value
  }
  for (const value of formData.values()) {
    if (value instanceof File && value.size > 0) return value
  }
  return null
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const purpose = (url.searchParams.get('purpose') ?? 'media') as UploadPurpose
  if (purpose !== 'media' && purpose !== 'avatar') {
    return NextResponse.json({ error: 'Invalid purpose' }, { status: 400 })
  }

  if (purpose === 'media') {
    const allowed = await can('media.upload', session.user.id)
    if (!allowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid multipart body' }, { status: 400 })
  }

  const file = getUploadFile(formData)
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (isBlockedExecutable(file.name, file.type)) {
    return NextResponse.json({ error: 'Executable files are not allowed' }, { status: 400 })
  }

  if (purpose === 'avatar' && !isAllowedAvatarMime(file.type)) {
    return NextResponse.json({ error: 'Avatar must be JPEG, PNG, WebP, or GIF' }, { status: 400 })
  }

  const folderId = formData.get('folderId') ? String(formData.get('folderId')) : null
  const folderPath = formData.get('folderPath') ? String(formData.get('folderPath')) : null

  try {
    const result = await processMediaUpload({
      file,
      folderId,
      folderPath,
      purpose,
      actorId: session.user.id,
    })
    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    const status = /too large|25MB|5MB|Executable|Avatar must|No file/i.test(message) ? 400 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

export async function DELETE(request: Request) {
  const session = await getSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const mediaId = (await request.text()).trim()
  if (!mediaId) {
    return NextResponse.json({ error: 'Missing media id' }, { status: 400 })
  }

  let authorized = await can('media.delete', session.user.id)
  if (!authorized) {
    const { mediaRepository } = await import('@/modules/media/repositories')
    const media = await mediaRepository.findById(mediaId)
    if (!media) {
      return NextResponse.json({ ok: true })
    }
    authorized = media.uploadedBy?.id === session.user.id
  }

  if (!authorized) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await revertMediaUpload(mediaId, session.user.id)
  return NextResponse.json({ ok: true })
}
