import { randomUUID } from 'crypto'
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
} from '@aws-sdk/client-s3'
import imageSize from 'image-size'
import { getPublicObjectUrl, type StorageConfig } from '@/lib/storage/config'
import { getResolvedStorageConfig } from '@/lib/storage/resolve-storage-config'
import { deleteMockObject, moveMockObject, writeMockObject } from '@/lib/storage/mock'
import { ALLOWED_MIME_TYPES, MAX_FILE_BYTES, getExtension } from '@/modules/media/constants'
import type { MediaVariants } from '@/modules/media/types'

const LEGACY_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
])

function getClient(config: StorageConfig) {
  return new S3Client({
    endpoint: config.endpoint,
    region: config.region,
    credentials: { accessKeyId: config.accessKey, secretAccessKey: config.secretKey },
    forcePathStyle: config.forcePathStyle,
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

async function putObject(key: string, buffer: Buffer, contentType: string, config: StorageConfig) {
  if (config.driver === 'mock') {
    await writeMockObject(key, buffer, config)
    return getPublicObjectUrl(key, config)
  }

  const client = getClient(config)
  await client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ContentLength: buffer.length,
    })
  )
  return getPublicObjectUrl(key, config)
}

function buildVariants(
  baseKey: string,
  baseUrl: string,
  mimeType: string,
  config: StorageConfig
): MediaVariants {
  if (!mimeType.startsWith('image/')) {
    return { thumbnail: baseUrl, small: baseUrl, medium: baseUrl, large: baseUrl }
  }
  return {
    thumbnail: getPublicObjectUrl(buildVariantKey(baseKey, 'thumb'), config),
    small: getPublicObjectUrl(buildVariantKey(baseKey, 'sm'), config),
    medium: getPublicObjectUrl(buildVariantKey(baseKey, 'md'), config),
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

  const config = await getResolvedStorageConfig()

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

  const url = await putObject(objectKey, buffer, mimeType, config)
  const variants = buildVariants(objectKey, url, mimeType, config)

  if (mimeType.startsWith('image/') && mimeType !== 'image/svg+xml') {
    for (const suffix of ['thumb', 'sm', 'md']) {
      const variantKey = buildVariantKey(objectKey, suffix)
      await putObject(variantKey, buffer, mimeType, config)
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
  const config = await getResolvedStorageConfig()
  const buffer = Buffer.from(await file.arrayBuffer())
  const url = await putObject(key, buffer, file.type, config)
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
    variants: buildVariants(key, url, file.type, config),
  }
}

export async function deleteObjectFromMinio(key: string) {
  const config = await getResolvedStorageConfig()
  if (config.driver === 'mock') {
    await deleteMockObject(key, config)
    return
  }

  const client = getClient(config)
  await client.send(new DeleteObjectCommand({ Bucket: config.bucket, Key: key }))
}

export async function moveObjectInMinio(oldKey: string, newKey: string) {
  const config = await getResolvedStorageConfig()
  if (config.driver === 'mock') {
    await moveMockObject(oldKey, newKey, config)
    return getPublicObjectUrl(newKey, config)
  }

  const client = getClient(config)
  await client.send(
    new CopyObjectCommand({
      Bucket: config.bucket,
      CopySource: `${config.bucket}/${oldKey}`,
      Key: newKey,
    })
  )
  await deleteObjectFromMinio(oldKey)
  return getPublicObjectUrl(newKey, config)
}
