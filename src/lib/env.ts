import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1).optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_UMAMI_ID: z.string().optional(),
  NEXT_UMAMI_SRC: z.string().optional(),
  NEXT_PUBLIC_GISCUS_REPO: z.string().optional(),
  NEXT_PUBLIC_GISCUS_REPOSITORY_ID: z.string().optional(),
  NEXT_PUBLIC_GISCUS_CATEGORY: z.string().optional(),
  NEXT_PUBLIC_GISCUS_CATEGORY_ID: z.string().optional(),
  MAILCHIMP_API_KEY: z.string().optional(),
  MAILCHIMP_API_SERVER: z.string().optional(),
  MAILCHIMP_AUDIENCE_ID: z.string().optional(),
  ANALYZE: z.string().optional(),
  BASE_PATH: z.string().optional(),
  AUTH_TRUST_HOST: z.string().optional(),
})

export type Env = z.infer<typeof envSchema>

let cached: Env | null = null

export function getEnv(): Env {
  if (!cached) {
    const parsed = envSchema.safeParse(process.env)
    if (!parsed.success) {
      const formatted = parsed.error.issues
        .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
        .join('\n')
      throw new Error(`Invalid environment variables:\n${formatted}`)
    }
    cached = parsed.data
  }
  return cached
}

export function requireDatabaseUrl(): string {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is required for database operations')
  }
  return url
}
