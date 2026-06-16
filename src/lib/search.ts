import { writeFileSync } from 'fs'
import path from 'path'
import { getSearchDocuments } from '@/services'

export async function syncSearchIndex() {
  const documents = await getSearchDocuments()
  const outputPath = path.join(process.cwd(), 'public/search.json')
  writeFileSync(outputPath, JSON.stringify(documents))
}
