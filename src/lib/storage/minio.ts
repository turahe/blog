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

export async function uploadFileToMinio(file: File, folderPath = 'media') {
  const allowed = new Set<string>([...ALLOWED_MIME_TYPES, ...LEGACY_IMAGE_TYPES])
  if (!allowed.has(file.type)) {
    throw new Error('File type is not allowed')
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error('File must be 25MB or smaller')
  }

  const buffer = Buffer.from(await file.arrayBuffer())
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

  const key = buildObjectKey(file.name, folderPath)
  const url = await putObject(key, buffer, file.type)

  const variants = buildVariants(key, url, file.type)

  // Store variant keys (same file for now; wire sharp later for true resizing)
  if (file.type.startsWith('image/') && file.type !== 'image/svg+xml') {
    for (const suffix of ['thumb', 'sm', 'md']) {
      const variantKey = buildVariantKey(key, suffix)
      await putObject(variantKey, buffer, file.type)
    }
  }

  return {
    key,
    url,
    filename: file.name,
    originalName: file.name,
    mimeType: file.type,
    extension: getExtension(file.name),
    size: file.size,
    width,
    height,
    variants,
  }
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
