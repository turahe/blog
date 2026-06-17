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
  const allowed = await can(permission)
  if (!allowed) {
    throw new Error('FORBIDDEN')
  }
}

export async function requireRole(role: string): Promise<void> {
  const allowed = await hasRole(role)
  if (!allowed) {
    throw new Error('FORBIDDEN')
  }
}

export async function requireAnyPermission(...permissions: string[]): Promise<void> {
  for (const p of permissions) {
    if (await can(p)) return
  }
  throw new Error('FORBIDDEN')
}
