export type StorageDriver = 'minio' | 'r2' | 'mock'

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
  /** Filesystem root for mock/local driver. */
  mockDirectory?: string
}

type SettingsMap = Record<string, string>

function trimTrailingSlash(url: string) {
  return url.replace(/\/$/, '')
}

function pickValue(
  envValue: string | undefined,
  settingValue: string | undefined,
  fallback: string
): string {
  if (envValue !== undefined && envValue !== '') return envValue
  if (settingValue !== undefined && settingValue !== '') return settingValue
  return fallback
}

function resolveDriver(settings: SettingsMap = {}): StorageDriver {
  const raw = (process.env.STORAGE_DRIVER ?? settings['storage.driver'] ?? 'minio').toLowerCase()

  if (raw === 'r2') return 'r2'
  if (raw === 'mock' || raw === 'local') return 'mock'
  return 'minio'
}

export function buildStorageConfig(settings: SettingsMap = {}): StorageConfig {
  const driver = resolveDriver(settings)

  if (driver === 'mock') {
    return {
      driver: 'mock',
      bucket: pickValue(
        process.env.MOCK_STORAGE_BUCKET,
        settings['storage.mock.bucket'],
        'blog-media'
      ),
      endpoint: 'mock://local',
      publicUrl: trimTrailingSlash(
        pickValue(
          process.env.MOCK_STORAGE_PUBLIC_URL,
          settings['storage.mock.public_url'],
          'https://storage.mock.test'
        )
      ),
      accessKey: 'mock',
      secretKey: 'mock',
      region: 'mock',
      forcePathStyle: true,
      publicUrlIncludesBucket: false,
      mockDirectory: pickValue(
        process.env.MOCK_STORAGE_DIR,
        settings['storage.mock.directory'],
        '.mock-storage'
      ),
    }
  }

  if (driver === 'r2') {
    const accountId = pickValue(process.env.R2_ACCOUNT_ID, settings['storage.r2.account_id'], '')
    const accessKey = pickValue(
      process.env.R2_ACCESS_KEY_ID ?? process.env.R2_ACCESS_KEY,
      settings['storage.r2.access_key_id'],
      ''
    )
    const secretKey = pickValue(
      process.env.R2_SECRET_ACCESS_KEY,
      settings['storage.r2.secret_access_key'],
      ''
    )
    const publicUrl = trimTrailingSlash(
      pickValue(process.env.R2_PUBLIC_URL, settings['storage.r2.public_url'], '')
    )

    if (!accountId) {
      throw new Error('R2 account ID is required (storage.r2.account_id or R2_ACCOUNT_ID)')
    }
    if (!accessKey || !secretKey) {
      throw new Error('R2 access credentials are required')
    }
    if (!publicUrl) {
      throw new Error('R2 public URL is required (storage.r2.public_url or R2_PUBLIC_URL)')
    }

    return {
      driver: 'r2',
      bucket: pickValue(process.env.R2_BUCKET, settings['storage.r2.bucket'], 'blog-media'),
      endpoint: trimTrailingSlash(
        pickValue(
          process.env.R2_ENDPOINT,
          settings['storage.r2.endpoint'],
          `https://${accountId}.r2.cloudflarestorage.com`
        )
      ),
      publicUrl,
      accessKey,
      secretKey,
      region: pickValue(process.env.R2_REGION, settings['storage.r2.region'], 'auto'),
      forcePathStyle: false,
      publicUrlIncludesBucket: false,
    }
  }

  const endpoint = pickValue(
    process.env.MINIO_ENDPOINT,
    settings['storage.minio.endpoint'],
    'http://localhost:9000'
  )
  const publicUrl = trimTrailingSlash(
    pickValue(process.env.MINIO_PUBLIC_URL, settings['storage.minio.public_url'], endpoint)
  )

  return {
    driver: 'minio',
    bucket: pickValue(process.env.MINIO_BUCKET, settings['storage.minio.bucket'], 'blog-media'),
    endpoint,
    publicUrl,
    accessKey: pickValue(
      process.env.MINIO_ACCESS_KEY,
      settings['storage.minio.access_key'],
      'minioadmin'
    ),
    secretKey: pickValue(
      process.env.MINIO_SECRET_KEY,
      settings['storage.minio.secret_key'],
      'minioadmin'
    ),
    region: pickValue(process.env.MINIO_REGION, settings['storage.minio.region'], 'us-east-1'),
    forcePathStyle: true,
    publicUrlIncludesBucket: true,
  }
}

export function getStorageDriver(settings: SettingsMap = {}): StorageDriver {
  return resolveDriver(settings)
}

/** Sync config from environment only (tests, scripts without DB). */
export function getStorageConfig(): StorageConfig {
  return buildStorageConfig()
}

export function getPublicObjectUrl(key: string, config?: StorageConfig) {
  const resolved = config ?? getStorageConfig()
  if (resolved.publicUrlIncludesBucket) {
    return `${resolved.publicUrl}/${resolved.bucket}/${key}`
  }
  return `${resolved.publicUrl}/${key}`
}
