import { promises as fs } from 'fs'
import path from 'path'
import { getStorageDriver } from '../src/lib/storage/config'
import { buildObjectKey, uploadBufferToMinio } from '../src/lib/storage/minio'
import { getMockStorageRoot } from '../src/lib/storage/mock'

async function main() {
  if (getStorageDriver() !== 'mock') {
    console.log(`Skipping storage upload test (STORAGE_DRIVER=${getStorageDriver()})`)
    return
  }

  const buffer = Buffer.from(`ci storage upload test ${new Date().toISOString()}`)
  const key = buildObjectKey('ci-upload.png', 'ci')
  const result = await uploadBufferToMinio(buffer, 'ci-upload.png', 'image/png', key)

  const root = getMockStorageRoot()
  await fs.mkdir(root, { recursive: true })
  await fs.writeFile(
    path.join(root, 'upload-result.json'),
    JSON.stringify(
      {
        driver: 'mock',
        key: result.key,
        url: result.url,
        size: result.size,
        mimeType: result.mimeType,
      },
      null,
      2
    )
  )

  console.log(`Mock storage upload OK: ${result.url}`)
  console.log(`Artifacts written under ${root}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
