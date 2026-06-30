import { cache } from 'react'
import { roleRepository } from '../repositories'
import { permissionRepository } from '@/modules/permissions/repositories'
import { isSystemRole } from '../constants'
import type { ListQueryParams } from '@/lib/crud/types'
import type { PermissionItem, RoleDetail, RoleMatrixRow, RbacAuditEntry } from '../types'
import { formatDate } from '@/lib/formatDate'

export const listRoles = cache(async (params: ListQueryParams) => {
  return roleRepository.findMany(params)
})

export const getRoleById = cache(async (id: string) => {
  return roleRepository.findById(id)
})

export const getAllRoles = cache(async () => {
  return roleRepository.findAll()
})

export async function getRoleDetail(id: string): Promise<RoleDetail | null> {
  const role = await roleRepository.findById(id)
  if (!role) return null

  return {
    id: role.id,
    slug: role.slug,
    name: role.name,
    description: role.description,
    isSystem: isSystemRole(role.slug),
    userCount: role._count.userRoles,
    permissionIds: role.rolePermissions.map((rp) => rp.permissionId),
    updatedAt: formatDate(role.updatedAt.toISOString()),
  }
}

export async function getAllPermissionsCatalog(): Promise<PermissionItem[]> {
  const permissions = await permissionRepository.findAll()
  return permissions.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    group: p.group,
    description: p.description,
  }))
}

export async function getPermissionMatrixData(): Promise<{
  roles: { id: string; slug: string; name: string; isSystem: boolean }[]
  rows: RoleMatrixRow[]
}> {
  const [roles, permissions] = await Promise.all([
    roleRepository.findAllWithPermissions(),
    permissionRepository.findAll(),
  ])

  const roleMeta = roles.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    isSystem: isSystemRole(r.slug),
    permissionIds: new Set(r.rolePermissions.map((rp) => rp.permission.id)),
  }))

  const rows: RoleMatrixRow[] = permissions.map((p) => {
    const permission: PermissionItem = {
      id: p.id,
      slug: p.slug,
      name: p.name,
      group: p.group,
      description: p.description,
    }

    const roleAccess: Record<string, boolean> = {}
    for (const role of roleMeta) {
      roleAccess[role.id] = role.slug === 'superadmin' || role.permissionIds.has(p.id)
    }

    return { permission, roleAccess }
  })

  return {
    roles: roleMeta.map(({ id, slug, name, isSystem }) => ({ id, slug, name, isSystem })),
    rows,
  }
}

export async function getRoleAuditTimeline(
  roleId: string,
  filters?: { actor?: string; from?: string; to?: string }
): Promise<RbacAuditEntry[]> {
  const logs = await roleRepository.listAuditLogs(roleId, 100)

  return logs
    .filter((log) => {
      if (filters?.actor) {
        const actor = log.actor?.email ?? ''
        if (!actor.toLowerCase().includes(filters.actor.toLowerCase())) return false
      }
      if (filters?.from && log.createdAt < new Date(filters.from)) return false
      if (filters?.to && log.createdAt > new Date(filters.to)) return false
      return true
    })
    .map((log) => ({
      id: log.id,
      actorName: log.actor?.fullName ?? 'System',
      actorEmail: log.actor?.email ?? 'system',
      action: log.action,
      summary: formatAuditSummary(log.action, log.before, log.after),
      createdAt: formatDate(log.createdAt.toISOString()),
    }))
}

function formatAuditSummary(action: string, before: unknown, after: unknown): string {
  const afterObj = after as Record<string, unknown> | null
  const beforeObj = before as Record<string, unknown> | null

  if (action === 'permissions_update' && afterObj) {
    const added = (afterObj.added as string[] | undefined) ?? []
    const removed = (afterObj.removed as string[] | undefined) ?? []
    const parts: string[] = []
    added.forEach((s) => parts.push(`+ ${s}`))
    removed.forEach((s) => parts.push(`− ${s}`))
    return parts.join(', ') || 'Permissions updated'
  }

  if (action === 'duplicate' && afterObj?.slug) {
    return `Duplicated as ${String(afterObj.slug)}`
  }

  if (action === 'create') return 'Role created'
  if (action === 'update') return 'Role metadata updated'
  if (action === 'delete') return 'Role deleted'

  if (beforeObj || afterObj) {
    return JSON.stringify(afterObj ?? beforeObj)
  }

  return action
}

export async function getPermissionSlugsForRoles(roleIds: string[]): Promise<Set<string>> {
  if (roleIds.length === 0) return new Set()

  const roles = await roleRepository.findAllWithPermissions()
  const selected = roles.filter((r) => roleIds.includes(r.id))
  const slugs = new Set<string>()

  for (const role of selected) {
    if (role.slug === 'superadmin') {
      return new Set(['*'])
    }
    for (const rp of role.rolePermissions) {
      slugs.add(rp.permission.slug)
    }
  }

  return slugs
}
