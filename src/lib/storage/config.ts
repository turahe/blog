export function getStorageConfig() {
  const bucket = process.env.MINIO_BUCKET ?? 'blog-media'
  const endpoint = process.env.MINIO_ENDPOINT ?? 'http://localhost:9000'
  const publicUrl = (process.env.MINIO_PUBLIC_URL ?? endpoint).replace(/\/$/, '')

  return {
    bucket,
    endpoint,
    publicUrl,
    accessKey: process.env.MINIO_ACCESS_KEY ?? 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY ?? 'minioadmin',
    region: process.env.MINIO_REGION ?? 'us-east-1',
  }
}

export function getPublicObjectUrl(key: string) {
  const { bucket, publicUrl } = getStorageConfig()
  return `${publicUrl}/${bucket}/${key}`
}
