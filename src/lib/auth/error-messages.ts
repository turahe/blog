/** Maps backend auth messages to human-friendly copy (no account enumeration). */
export function formatAuthError(message?: string | null): string {
  if (!message) return 'Something went wrong. Please try again.'

  const normalized = message.toLowerCase()

  if (
    normalized.includes('invalid email or password') ||
    normalized.includes('invalid credentials')
  ) {
    return 'Email or password is incorrect.'
  }
  if (normalized.includes('csrf') || normalized.includes('security token')) {
    return 'Your session expired. Please refresh the page and try again.'
  }
  if (normalized.includes('too many') || normalized.includes('rate limit')) {
    return 'Too many sign-in attempts. Please wait a few minutes and try again.'
  }
  if (normalized.includes('network') || normalized.includes('fetch')) {
    return 'We could not reach the server. Check your connection and try again.'
  }

  return message
}

export const AUTH_PAGE_ERRORS = {
  forbidden: 'You do not have permission to access that area.',
  sessionExpired: 'Your session has expired. Please sign in again.',
  unauthorized: 'You need to sign in to continue.',
} as const
