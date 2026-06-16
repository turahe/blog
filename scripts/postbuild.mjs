import { execSync } from 'child_process'

async function postbuild() {
  try {
    execSync('npx tsx scripts/rss.ts', { stdio: 'inherit' })
  } catch (error) {
    console.warn('RSS generation skipped (database may be unavailable during build):', error)
  }

  try {
    execSync('npx tsx scripts/sync-search.ts', { stdio: 'inherit' })
  } catch (error) {
    console.warn('Search index sync skipped (database may be unavailable during build):', error)
  }
}

postbuild()
