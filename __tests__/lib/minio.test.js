const mockSend = jest.fn()
const mockImageSize = jest.fn()

jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'fixed-uuid'),
}))

jest.mock('image-size', () => mockImageSize)

jest.mock('@aws-sdk/client-s3', () => {
  class S3Client {
    send(command) {
      return mockSend(command)
    }
  }

  class PutObjectCommand {
    constructor(input) {
      this.input = input
    }
  }

  class DeleteObjectCommand {
    constructor(input) {
      this.input = input
    }
  }

  class CopyObjectCommand {
    constructor(input) {
      this.input = input
    }
  }

  return {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    CopyObjectCommand,
  }
})

jest.mock('@/lib/storage/resolve-storage-config', () => ({
  getResolvedStorageConfig: jest.fn(async () => ({
    driver: 'minio',
    bucket: 'blog-media',
    endpoint: 'http://localhost:9000',
    publicUrl: 'http://cdn.local',
    accessKey: 'minioadmin',
    secretKey: 'minioadmin',
    region: 'us-east-1',
    forcePathStyle: true,
    publicUrlIncludesBucket: true,
  })),
}))

jest.mock('@/lib/storage/config', () => ({
  getPublicObjectUrl: jest.fn((key) => `http://cdn.local/blog-media/${key}`),
}))

const {
  buildObjectKey,
  uploadBufferToMinio,
  deleteObjectFromMinio,
  moveObjectInMinio,
} = require('@/lib/storage/minio')

describe('minio storage helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers().setSystemTime(new Date('2026-06-17T00:00:00.000Z'))
    mockImageSize.mockReturnValue({ width: 800, height: 600 })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('buildObjectKey creates date-based sanitized key', () => {
    const key = buildObjectKey('My File.JPG', 'uploads/')
    expect(key).toBe('uploads/2026/06/fixed-uuid-my-file.jpg')
  })

  test('uploadBufferToMinio uploads image variants and dimensions', async () => {
    const buffer = Buffer.from('image-bytes')
    const result = await uploadBufferToMinio(
      buffer,
      'photo.png',
      'image/png',
      'media/2026/06/file.png'
    )

    expect(result.url).toBe('http://cdn.local/blog-media/media/2026/06/file.png')
    expect(result.width).toBe(800)
    expect(result.height).toBe(600)
    expect(result.variants).toEqual({
      thumbnail: 'http://cdn.local/blog-media/media/2026/06/file-thumb.png',
      small: 'http://cdn.local/blog-media/media/2026/06/file-sm.png',
      medium: 'http://cdn.local/blog-media/media/2026/06/file-md.png',
      large: 'http://cdn.local/blog-media/media/2026/06/file.png',
    })
    expect(mockSend).toHaveBeenCalledTimes(4)
  })

  test('uploadBufferToMinio for non-image uses base url variants', async () => {
    const buffer = Buffer.from('pdf-bytes')
    const result = await uploadBufferToMinio(
      buffer,
      'file.pdf',
      'application/pdf',
      'media/2026/06/file.pdf'
    )

    expect(result.width).toBeUndefined()
    expect(result.height).toBeUndefined()
    expect(result.variants).toEqual({
      thumbnail: 'http://cdn.local/blog-media/media/2026/06/file.pdf',
      small: 'http://cdn.local/blog-media/media/2026/06/file.pdf',
      medium: 'http://cdn.local/blog-media/media/2026/06/file.pdf',
      large: 'http://cdn.local/blog-media/media/2026/06/file.pdf',
    })
    expect(mockSend).toHaveBeenCalledTimes(1)
  })

  test('uploadBufferToMinio rejects unsupported mime type', async () => {
    await expect(
      uploadBufferToMinio(
        Buffer.from('x'),
        'malware.exe',
        'application/x-msdownload',
        'media/x.exe'
      )
    ).rejects.toThrow('File type is not allowed')
  })

  test('deleteObjectFromMinio sends delete command', async () => {
    await deleteObjectFromMinio('media/2026/06/file.png')
    expect(mockSend).toHaveBeenCalledTimes(1)
    expect(mockSend.mock.calls[0][0].input).toEqual({
      Bucket: 'blog-media',
      Key: 'media/2026/06/file.png',
    })
  })

  test('moveObjectInMinio copies then deletes old object', async () => {
    const url = await moveObjectInMinio('media/old.png', 'media/new.png')
    expect(url).toBe('http://cdn.local/blog-media/media/new.png')
    expect(mockSend).toHaveBeenCalledTimes(2)
    expect(mockSend.mock.calls[0][0].input).toEqual({
      Bucket: 'blog-media',
      CopySource: 'blog-media/media/old.png',
      Key: 'media/new.png',
    })
    expect(mockSend.mock.calls[1][0].input).toEqual({
      Bucket: 'blog-media',
      Key: 'media/old.png',
    })
  })
})
