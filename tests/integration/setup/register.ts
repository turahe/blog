import { config } from 'dotenv'
import { resolve } from 'path'
import { after, before } from 'node:test'
import { Client } from 'pg'
import prisma from '@/lib/db/prisma'

config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })

if (!process.env.DATABASE_URL) {
  if (process.env.CI) {
    throw new Error('DATABASE_URL is required for integration tests in CI')
  }
  console.warn('\n⚠️  DATABASE_URL not set — integration tests will be skipped')
  console.warn('   Start Postgres and run: npx prisma db push && npx prisma db seed\n')
  process.env.SKIP_INTEGRATION_TESTS = '1'
}

async function verifyDatabase() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) return

  const client = new Client({ connectionString: databaseUrl })

  try {
    await client.connect()
    await client.query('SELECT 1')

    const posts = await client.query('SELECT COUNT(*)::int AS count FROM posts')
    const users = await client.query(
      `SELECT COUNT(*)::int AS count FROM users WHERE email = 'admin@example.com'`
    )

    const postCount = posts.rows[0]?.count ?? 0
    const userCount = users.rows[0]?.count ?? 0

    if (postCount === 0 || userCount === 0) {
      throw new Error(
        'Integration tests require seeded data. Run: npx prisma db push && npx prisma db seed'
      )
    }

    console.log('✅ Integration test database is ready')
  } finally {
    await client.end().catch(() => {})
  }
}

before(async () => {
  await verifyDatabase()
})

after(async () => {
  await prisma.$disconnect()
})
