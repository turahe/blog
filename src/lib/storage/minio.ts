import { randomUUID } from 'crypto'
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
} from '@aws-sdk/client-s3'
import imageSize from 'image-size'
import { getPublicObjectUrl, getStorageConfig } from '@/lib/storage/config'
import { ALLOWED_MIME_TYPES, MAX_FILE_BYTES, getExtension } from '@/modules/media/constants'
import type { MediaVariants } from '@/modules/media/types'

const LEGACY_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
])

function getClient() {
  const { endpoint, accessKey, secretKey, region } = getStorageConfig()
  return new S3Client({
    endpoint,
    region,
    credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
    forcePathStyle: true,
  })
}

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase()
}

export function buildObjectKey(filename: string, folderPath = 'media') {
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = String(now.getUTCMonth() + 1).padStart(2, '0')
  const safe = sanitizeFilename(filename)
  const prefix = folderPath.replace(/\/$/, '')
  return `${prefix}/${year}/${month}/${randomUUID()}-${safe}`
}

function buildVariantKey(baseKey: string, size: string) {
  const dot = baseKey.lastIndexOf('.')
  if (dot === -1) return `${baseKey}-${size}`
  return `${baseKey.slice(0, dot)}-${size}${baseKey.slice(dot)}`
}

async function putObject(key: string, buffer: Buffer, contentType: string) {
  const { bucket } = getStorageConfig()
  const client = getClient()
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ContentLength: buffer.length,
    })
  )
  return getPublicObjectUrl(key)
}

function buildVariants(baseKey: string, baseUrl: string, mimeType: string): MediaVariants {
  if (!mimeType.startsWith('image/')) {
    return { thumbnail: baseUrl, small: baseUrl, medium: baseUrl, large: baseUrl }
  }
  return {
    thumbnail: getPublicObjectUrl(buildVariantKey(baseKey, 'thumb')),
    small: getPublicObjectUrl(buildVariantKey(baseKey, 'sm')),
    medium: getPublicObjectUrl(buildVariantKey(baseKey, 'md')),
    large: baseUrl,
  }
}

export async function uploadBufferToMinio(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  objectKey: string
) {
  const allowed = new Set<string>([...ALLOWED_MIME_TYPES, ...LEGACY_IMAGE_TYPES])
  if (!allowed.has(mimeType)) {
    throw new Error('File type is not allowed')
  }
  if (buffer.length > MAX_FILE_BYTES) {
    throw new Error('File must be 25MB or smaller')
  }

  let width: number | undefined
  let height: number | undefined
  if (mimeType.startsWith('image/') && mimeType !== 'image/svg+xml') {
    try {
      const dims = imageSize(buffer)
      width = dims.width
      height = dims.height
    } catch {
      /* ignore */
    }
  }

  const url = await putObject(objectKey, buffer, mimeType)
  const variants = buildVariants(objectKey, url, mimeType)

  if (mimeType.startsWith('image/') && mimeType !== 'image/svg+xml') {
    for (const suffix of ['thumb', 'sm', 'md']) {
      const variantKey = buildVariantKey(objectKey, suffix)
      await putObject(variantKey, buffer, mimeType)
    }
  }

  return {
    key: objectKey,
    url,
    filename,
    originalName: filename,
    mimeType,
    extension: getExtension(filename),
    size: buffer.length,
    width,
    height,
    variants,
  }
}

export async function uploadFileToMinio(file: File, folderPath = 'media') {
  const allowed = new Set<string>([...ALLOWED_MIME_TYPES, ...LEGACY_IMAGE_TYPES])
  if (!allowed.has(file.type)) {
    throw new Error('File type is not allowed')
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error('File must be 25MB or smaller')
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const key = buildObjectKey(file.name, folderPath)
  return uploadBufferToMinio(buffer, file.name, file.type, key)
}

export async function replaceFileInMinio(key: string, file: File) {
  const buffer = Buffer.from(await file.arrayBuffer())
  const url = await putObject(key, buffer, file.type)
  let width: number | undefined
  let height: number | undefined
  if (file.type.startsWith('image/') && file.type !== 'image/svg+xml') {
    try {
      const dims = imageSize(buffer)
      width = dims.width
      height = dims.height
    } catch {
      /* ignore */
    }
  }
  return {
    url,
    mimeType: file.type,
    size: file.size,
    width,
    height,
    variants: buildVariants(key, url, file.type),
  }
}

export async function deleteObjectFromMinio(key: string) {
  const { bucket } = getStorageConfig()
  const client = getClient()
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
}

export async function moveObjectInMinio(oldKey: string, newKey: string) {
  const { bucket } = getStorageConfig()
  const client = getClient()
  await client.send(
    new CopyObjectCommand({
      Bucket: bucket,
      CopySource: `${bucket}/${oldKey}`,
      Key: newKey,
    })
  )
  await deleteObjectFromMinio(oldKey)
  return getPublicObjectUrl(newKey)
}
