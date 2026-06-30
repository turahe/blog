import { getSession } from '@/lib/auth/session'
import { getUserPermissions, getUserRoles } from './cache'

export async function can(permission: string, userId?: string): Promise<boolean> {
  const uid = userId ?? (await getSession())?.user.id
  if (!uid) return false

  const permissions = await getUserPermissions(uid)
  if (permissions.has(permission)) return true

  // superadmin bypass
  const roles = await getUserRoles(uid)
  return roles.has('superadmin')
}

export async function hasRole(role: string, userId?: string): Promise<boolean> {
  const uid = userId ?? (await getSession())?.user.id
  if (!uid) return false

  const roles = await getUserRoles(uid)
  return roles.has(role) || roles.has('superadmin')
}

export async function requirePermission(permission: string): Promise<void> {
  const session = await getSession()
  if (!session) {
    throw new Error('FORBIDDEN')
  }

  const allowed = await can(permission, session.user.id)
  if (!allowed) {
    throw new Error('FORBIDDEN')
  }
}

export async function requireRole(role: string): Promise<void> {
  const session = await getSession()
  if (!session) {
    throw new Error('FORBIDDEN')
  }

  const allowed = await hasRole(role, session.user.id)
  if (!allowed) {
    throw new Error('FORBIDDEN')
  }
}

export async function requireAnyPermission(...permissions: string[]): Promise<void> {
  const session = await getSession()
  if (!session) {
    throw new Error('FORBIDDEN')
  }

  const userId = session.user.id
  const userPermissions = await getUserPermissions(userId)

  for (const permission of permissions) {
    if (userPermissions.has(permission)) return
  }

  const roles = await getUserRoles(userId)
  if (roles.has('superadmin')) return

  throw new Error('FORBIDDEN')
}
