import { promises as fs } from 'fs'
import path from 'path'
import type { StorageConfig } from './config'

export function getMockStorageRoot(config?: StorageConfig) {
  const relative = config?.mockDirectory ?? process.env.MOCK_STORAGE_DIR ?? '.mock-storage'
  return path.resolve(process.cwd(), relative)
}

function objectPath(key: string, config?: StorageConfig) {
  const bucket = config?.bucket ?? process.env.MOCK_STORAGE_BUCKET ?? 'blog-media'
  return path.join(getMockStorageRoot(config), bucket, key)
}

export async function writeMockObject(key: string, buffer: Buffer, config?: StorageConfig) {
  const filePath = objectPath(key, config)
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, buffer)
}

export async function deleteMockObject(key: string, config?: StorageConfig) {
  await fs.unlink(objectPath(key, config)).catch(() => undefined)
}

export async function moveMockObject(oldKey: string, newKey: string, config?: StorageConfig) {
  const from = objectPath(oldKey, config)
  const to = objectPath(newKey, config)
  await fs.mkdir(path.dirname(to), { recursive: true })
  await fs.rename(from, to)
}
