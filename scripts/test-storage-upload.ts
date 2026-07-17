import { promises as fs } from 'fs'
import path from 'path'
import { getStorageDriver } from '../src/lib/storage/config'
import {
  buildObjectKey,
  deleteObjectFromMinio,
  uploadBufferToMinio,
} from '../src/lib/storage/minio'

const ARTIFACT_DIR = '.ci-storage'

async function main() {
  const driver = getStorageDriver()
  if (driver !== 'r2' && driver !== 'minio') {
    console.log(`Skipping storage upload test (STORAGE_DRIVER=${driver})`)
    return
  }

  const buffer = Buffer.from(`ci storage upload test ${new Date().toISOString()}`)
  const key = buildObjectKey('ci-upload.txt', 'ci')
  const result = await uploadBufferToMinio(buffer, 'ci-upload.txt', 'text/plain', key)

  const artifactRoot = path.resolve(ARTIFACT_DIR)
  await fs.mkdir(artifactRoot, { recursive: true })
  await fs.writeFile(
    path.join(artifactRoot, 'upload-result.json'),
    JSON.stringify(
      {
        driver,
        key: result.key,
        url: result.url,
        size: result.size,
        mimeType: result.mimeType,
      },
      null,
      2
    )
  )

  console.log(`${driver} storage upload OK: ${result.url}`)

  await deleteObjectFromMinio(result.key)
  console.log(`Cleaned up ${driver} object: ${result.key}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
