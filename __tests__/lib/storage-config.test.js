const { getStorageConfig, getPublicObjectUrl } = require('@/lib/storage/config')

describe('storage config', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
    delete process.env.MINIO_BUCKET
    delete process.env.MINIO_ENDPOINT
    delete process.env.MINIO_PUBLIC_URL
    delete process.env.MINIO_ACCESS_KEY
    delete process.env.MINIO_SECRET_KEY
    delete process.env.MINIO_REGION
  })

  afterAll(() => {
    process.env = originalEnv
  })

  test('getStorageConfig returns defaults', () => {
    expect(getStorageConfig()).toEqual({
      bucket: 'blog-media',
      endpoint: 'http://localhost:9000',
      publicUrl: 'http://localhost:9000',
      accessKey: 'minioadmin',
      secretKey: 'minioadmin',
      region: 'us-east-1',
    })
  })

  test('getStorageConfig reads environment overrides', () => {
    process.env.MINIO_BUCKET = 'assets'
    process.env.MINIO_ENDPOINT = 'http://minio:9000'
    process.env.MINIO_PUBLIC_URL = 'https://cdn.example.com/'
    process.env.MINIO_ACCESS_KEY = 'key'
    process.env.MINIO_SECRET_KEY = 'secret'
    process.env.MINIO_REGION = 'ap-southeast-1'

    expect(getStorageConfig()).toEqual({
      bucket: 'assets',
      endpoint: 'http://minio:9000',
      publicUrl: 'https://cdn.example.com',
      accessKey: 'key',
      secretKey: 'secret',
      region: 'ap-southeast-1',
    })
  })

  test('getPublicObjectUrl builds bucket path', () => {
    process.env.MINIO_PUBLIC_URL = 'https://cdn.example.com'
    process.env.MINIO_BUCKET = 'blog-media'

    expect(getPublicObjectUrl('media/2026/06/photo.png')).toBe(
      'https://cdn.example.com/blog-media/media/2026/06/photo.png'
    )
  })
})
