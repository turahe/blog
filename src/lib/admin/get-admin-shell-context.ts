import { cache } from 'react'
import { getSession, type AuthSession } from '@/lib/auth/session'
import { can } from '@/lib/rbac'
import { primeUserRbacCache } from '@/lib/rbac/cache'
import {
  buildAdminHeaderUser,
  loadUserShellProfile,
  type AdminHeaderUser,
} from '@/lib/admin/get-header-user'

export type AuthenticatedShellContext = {
  session: AuthSession
  headerUser: AdminHeaderUser
}

export type AdminLayoutContext =
  | { status: 'ok'; session: AuthSession; headerUser: AdminHeaderUser }
  | { status: 'unauthenticated' }
  | { status: 'forbidden' }

async function loadAuthenticatedShellContext(): Promise<AuthenticatedShellContext | null> {
  const session = await getSession()
  if (!session) return null

  const profile = await loadUserShellProfile(session.user.id)
  if (!profile) return null

  return {
    session,
    headerUser: buildAdminHeaderUser(session.user, profile),
  }
}

/** Session + header user for account/notifications shells (no dashboard permission check). */
export const getAuthenticatedShellContext = cache(loadAuthenticatedShellContext)

/**
 * Admin layout: one user profile query primes RBAC cache, then checks dashboard.view
 * without a separate RBAC database round-trip.
 */
export const getAdminLayoutContext = cache(async (): Promise<AdminLayoutContext> => {
  const session = await getSession()
  if (!session) return { status: 'unauthenticated' }

  const profile = await loadUserShellProfile(session.user.id)
  if (!profile) return { status: 'unauthenticated' }

  primeUserRbacCache(session.user.id, profile.userRoles)

  const allowed = await can('dashboard.view', session.user.id)
  if (!allowed) return { status: 'forbidden' }

  return {
    status: 'ok',
    session,
    headerUser: buildAdminHeaderUser(session.user, profile),
  }
})
