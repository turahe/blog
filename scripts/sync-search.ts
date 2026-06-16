import { syncSearchIndex } from '../src/lib/search'

async function main() {
  await syncSearchIndex()
  console.log('Search index synced to public/search.json')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
