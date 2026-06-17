export type StorageDriver = 'minio' | 'r2'

export type StorageConfig = {
  driver: StorageDriver
  bucket: string
  endpoint: string
  publicUrl: string
  accessKey: string
  secretKey: string
  region: string
  forcePathStyle: boolean
  /** When false, public URLs omit the bucket segment (R2 custom domain / r2.dev). */
  publicUrlIncludesBucket: boolean
}

function trimTrailingSlash(url: string) {
  return url.replace(/\/$/, '')
}

export function getStorageDriver(): StorageDriver {
  const driver = process.env.STORAGE_DRIVER?.toLowerCase()
  if (driver === 'r2') return 'r2'
  return 'minio'
}

function getMinioConfig(): StorageConfig {
  const endpoint = process.env.MINIO_ENDPOINT ?? 'http://localhost:9000'
  const publicUrl = trimTrailingSlash(process.env.MINIO_PUBLIC_URL ?? endpoint)

  return {
    driver: 'minio',
    bucket: process.env.MINIO_BUCKET ?? 'blog-media',
    endpoint,
    publicUrl,
    accessKey: process.env.MINIO_ACCESS_KEY ?? 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY ?? 'minioadmin',
    region: process.env.MINIO_REGION ?? 'us-east-1',
    forcePathStyle: true,
    publicUrlIncludesBucket: true,
  }
}

function getR2Config(): StorageConfig {
  const accountId = process.env.R2_ACCOUNT_ID
  if (!accountId) {
    throw new Error('R2_ACCOUNT_ID is required when STORAGE_DRIVER=r2')
  }

  const accessKey = process.env.R2_ACCESS_KEY_ID ?? process.env.R2_ACCESS_KEY
  const secretKey = process.env.R2_SECRET_ACCESS_KEY
  if (!accessKey || !secretKey) {
    throw new Error('R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY are required when STORAGE_DRIVER=r2')
  }

  const endpoint = trimTrailingSlash(
    process.env.R2_ENDPOINT ?? `https://${accountId}.r2.cloudflarestorage.com`
  )
  const publicUrl = trimTrailingSlash(
    process.env.R2_PUBLIC_URL ?? process.env.MINIO_PUBLIC_URL ?? ''
  )
  if (!publicUrl) {
    throw new Error(
      'R2_PUBLIC_URL is required when STORAGE_DRIVER=r2 (R2 bucket public URL or custom domain)'
    )
  }

  return {
    driver: 'r2',
    bucket: process.env.R2_BUCKET ?? process.env.MINIO_BUCKET ?? 'blog-media',
    endpoint,
    publicUrl,
    accessKey,
    secretKey,
    region: process.env.R2_REGION ?? 'auto',
    forcePathStyle: false,
    publicUrlIncludesBucket: false,
  }
}

export function getStorageConfig(): StorageConfig {
  return getStorageDriver() === 'r2' ? getR2Config() : getMinioConfig()
}

export function getPublicObjectUrl(key: string) {
  const { bucket, publicUrl, publicUrlIncludesBucket } = getStorageConfig()
  if (publicUrlIncludesBucket) {
    return `${publicUrl}/${bucket}/${key}`
  }
  return `${publicUrl}/${key}`
}
