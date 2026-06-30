import { cache } from 'react'
import prisma from '@/lib/db/prisma'

const permissionCache = new Map<
  string,
  { permissions: Set<string>; roles: Set<string>; expires: number }
>()
const CACHE_TTL_MS = 5 * 60 * 1000

export type UserRoleRbacRow = {
  role: {
    slug: string
    deletedAt: Date | null
    rolePermissions: { permission: { slug: string } }[]
  }
}

function getCacheKey(userId: string): string {
  return `rbac:${userId}`
}

function buildRbacSetsFromUserRoles(userRoles: UserRoleRbacRow[]): {
  permissions: Set<string>
  roles: Set<string>
} {
  const roles = new Set<string>()
  const permissions = new Set<string>()

  for (const ur of userRoles) {
    if (ur.role.deletedAt) continue
    roles.add(ur.role.slug)
    for (const rp of ur.role.rolePermissions) {
      permissions.add(rp.permission.slug)
    }
  }

  return { permissions, roles }
}

function storeUserRbacCache(
  userId: string,
  permissions: Set<string>,
  roles: Set<string>
): { permissions: Set<string>; roles: Set<string> } {
  permissionCache.set(getCacheKey(userId), {
    permissions,
    roles,
    expires: Date.now() + CACHE_TTL_MS,
  })
  return { permissions, roles }
}

/** Prime the in-memory RBAC cache from data already loaded for layout/shell. */
export function primeUserRbacCache(
  userId: string,
  userRoles: UserRoleRbacRow[]
): { permissions: Set<string>; roles: Set<string> } {
  const { permissions, roles } = buildRbacSetsFromUserRoles(userRoles)
  return storeUserRbacCache(userId, permissions, roles)
}

async function loadUserRbac(
  userId: string
): Promise<{ permissions: Set<string>; roles: Set<string> }> {
  const cached = permissionCache.get(getCacheKey(userId))
  if (cached && cached.expires > Date.now()) {
    return { permissions: cached.permissions, roles: cached.roles }
  }

  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: {
      role: {
        include: {
          rolePermissions: {
            include: { permission: { select: { slug: true } } },
          },
        },
      },
    },
  })

  const { permissions, roles } = buildRbacSetsFromUserRoles(userRoles)
  return storeUserRbacCache(userId, permissions, roles)
}

export function invalidatePermissionCache(userId: string): void {
  permissionCache.delete(getCacheKey(userId))
}

export function invalidateAllPermissionCache(): void {
  permissionCache.clear()
}

export const getUserPermissions = cache(async (userId: string): Promise<Set<string>> => {
  const { permissions } = await loadUserRbac(userId)
  return permissions
})

export const getUserRoles = cache(async (userId: string): Promise<Set<string>> => {
  const { roles } = await loadUserRbac(userId)
  return roles
})
