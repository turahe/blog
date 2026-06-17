import { isDatabaseUnavailableError } from './errors'

export async function withDatabaseFallback<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await query()
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return fallback
    }
    throw error
  }
}
