const { getStorageConfig, getPublicObjectUrl, getStorageDriver } = require('@/lib/storage/config')

describe('storage config', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
    delete process.env.STORAGE_DRIVER
    delete process.env.MINIO_BUCKET
    delete process.env.MINIO_ENDPOINT
    delete process.env.MINIO_PUBLIC_URL
    delete process.env.MINIO_ACCESS_KEY
    delete process.env.MINIO_SECRET_KEY
    delete process.env.MINIO_REGION
    delete process.env.R2_ACCOUNT_ID
    delete process.env.R2_ACCESS_KEY_ID
    delete process.env.R2_ACCESS_KEY
    delete process.env.R2_SECRET_ACCESS_KEY
    delete process.env.R2_BUCKET
    delete process.env.R2_PUBLIC_URL
    delete process.env.R2_REGION
    delete process.env.R2_ENDPOINT
  })

  afterAll(() => {
    process.env = originalEnv
  })

  test('getStorageDriver defaults to minio', () => {
    expect(getStorageDriver()).toBe('minio')
  })

  test('getStorageConfig returns MinIO defaults', () => {
    expect(getStorageConfig()).toEqual({
      driver: 'minio',
      bucket: 'blog-media',
      endpoint: 'http://localhost:9000',
      publicUrl: 'http://localhost:9000',
      accessKey: 'minioadmin',
      secretKey: 'minioadmin',
      region: 'us-east-1',
      forcePathStyle: true,
      publicUrlIncludesBucket: true,
    })
  })

  test('getStorageConfig reads MinIO environment overrides', () => {
    process.env.MINIO_BUCKET = 'assets'
    process.env.MINIO_ENDPOINT = 'http://minio:9000'
    process.env.MINIO_PUBLIC_URL = 'https://cdn.example.com/'
    process.env.MINIO_ACCESS_KEY = 'key'
    process.env.MINIO_SECRET_KEY = 'secret'
    process.env.MINIO_REGION = 'ap-southeast-1'

    expect(getStorageConfig()).toEqual({
      driver: 'minio',
      bucket: 'assets',
      endpoint: 'http://minio:9000',
      publicUrl: 'https://cdn.example.com',
      accessKey: 'key',
      secretKey: 'secret',
      region: 'ap-southeast-1',
      forcePathStyle: true,
      publicUrlIncludesBucket: true,
    })
  })

  test('getPublicObjectUrl builds MinIO bucket path', () => {
    process.env.MINIO_PUBLIC_URL = 'https://cdn.example.com'
    process.env.MINIO_BUCKET = 'blog-media'

    expect(getPublicObjectUrl('media/2026/06/photo.png')).toBe(
      'https://cdn.example.com/blog-media/media/2026/06/photo.png'
    )
  })

  test('getStorageConfig returns R2 settings', () => {
    process.env.STORAGE_DRIVER = 'r2'
    process.env.R2_ACCOUNT_ID = 'abc123'
    process.env.R2_ACCESS_KEY_ID = 'r2-key'
    process.env.R2_SECRET_ACCESS_KEY = 'r2-secret'
    process.env.R2_BUCKET = 'assets'
    process.env.R2_PUBLIC_URL = 'https://cdn.example.com/'

    expect(getStorageConfig()).toEqual({
      driver: 'r2',
      bucket: 'assets',
      endpoint: 'https://abc123.r2.cloudflarestorage.com',
      publicUrl: 'https://cdn.example.com',
      accessKey: 'r2-key',
      secretKey: 'r2-secret',
      region: 'auto',
      forcePathStyle: false,
      publicUrlIncludesBucket: false,
    })
  })

  test('getPublicObjectUrl omits bucket for R2 public URLs', () => {
    process.env.STORAGE_DRIVER = 'r2'
    process.env.R2_ACCOUNT_ID = 'abc123'
    process.env.R2_ACCESS_KEY_ID = 'r2-key'
    process.env.R2_SECRET_ACCESS_KEY = 'r2-secret'
    process.env.R2_PUBLIC_URL = 'https://pub-abc.r2.dev'

    expect(getPublicObjectUrl('media/2026/06/photo.png')).toBe(
      'https://pub-abc.r2.dev/media/2026/06/photo.png'
    )
  })

  test('getStorageConfig throws when R2 env is incomplete', () => {
    process.env.STORAGE_DRIVER = 'r2'
    expect(() => getStorageConfig()).toThrow('R2_ACCOUNT_ID is required')
  })
})
