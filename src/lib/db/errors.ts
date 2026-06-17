const UNAVAILABLE_CODES = new Set(['P1000', 'P1001', 'P1017', 'P2021'])

export function isDatabaseUnavailableError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false

  const code = 'code' in error ? String(error.code) : ''
  if (UNAVAILABLE_CODES.has(code)) return true

  const cause = 'cause' in error ? error.cause : undefined
  if (cause && cause !== error) return isDatabaseUnavailableError(cause)

  return false
}
