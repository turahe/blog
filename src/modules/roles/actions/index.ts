'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth/session'
import { requirePermission } from '@/lib/rbac'
import { invalidateAllPermissionCache } from '@/lib/rbac/cache'
import { logAudit } from '@/lib/audit'
import { sanitizeString } from '@/lib/security/sanitize'
import { permissionRepository } from '@/modules/permissions/repositories'
import { roleRepository } from '../repositories'
import { createRoleSchema, updateRoleSchema } from '../validators'
import { isSystemRole } from '../constants'
import { diffPermissionIds } from '../utils/permissions'
import { getPermissionSlugsForRoles } from '../services'
import type { CrudActionResult } from '@/lib/crud/types'
import type { PermissionChangePreview, PermissionItem } from '../types'

function revalidateRolePaths(roleId?: string) {
  revalidatePath('/admin/roles')
  revalidatePath('/admin/roles/matrix')
  if (roleId) revalidatePath(`/admin/roles/${roleId}`)
}

async function getPermissionCatalog(): Promise<PermissionItem[]> {
  const permissions = await permissionRepository.findAll()
  return permissions.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    group: p.group,
    description: p.description,
  }))
}

export async function previewRolePermissionChangesAction(
  originalIds: string[],
  nextIds: string[]
): Promise<CrudActionResult<PermissionChangePreview>> {
  await requirePermission('roles.update')
  const catalog = await getPermissionCatalog()
  const preview = diffPermissionIds(originalIds, nextIds, catalog)
  return { success: true, data: preview }
}

export async function createRoleAction(input: unknown): Promise<CrudActionResult<{ id: string }>> {
  await requirePermission('roles.create')
  const session = await getSession()
  const parsed = createRoleSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message }

  const existing = await roleRepository.findBySlug(parsed.data.slug)
  if (existing) return { success: false, error: 'A role with this slug already exists' }

  const role = await roleRepository.create({
    slug: parsed.data.slug,
    name: sanitizeString(parsed.data.name, 100),
    description: parsed.data.description ? sanitizeString(parsed.data.description, 500) : null,
    createdById: session?.user.id,
  })

  if (parsed.data.permissionIds.length > 0) {
    await roleRepository.setPermissions(role.id, parsed.data.permissionIds)
  }

  const catalog = await getPermissionCatalog()
  const added = parsed.data.permissionIds
    .map((id) => catalog.find((p) => p.id === id)?.slug)
    .filter((slug): slug is string => Boolean(slug))

  await logAudit({
    actorId: session?.user.id,
    entity: 'role',
    entityId: role.id,
    action: 'create',
    after: { slug: role.slug, name: role.name, permissions: added },
  })

  invalidateAllPermissionCache()
  revalidateRolePaths(role.id)
  return { success: true, data: { id: role.id } }
}

export async function updateRoleAction(id: string, input: unknown): Promise<CrudActionResult> {
  await requirePermission('roles.update')
  const session = await getSession()
  const parsed = updateRoleSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message }

  const before = await roleRepository.findById(id)
  if (!before) return { success: false, error: 'Role not found' }

  if (isSystemRole(before.slug) && parsed.data.slug && parsed.data.slug !== before.slug) {
    return { success: false, error: 'Cannot change slug of a system role' }
  }

  const data: Record<string, unknown> = {
    updatedById: session?.user.id,
  }
  if (parsed.data.slug) data.slug = parsed.data.slug
  if (parsed.data.name) data.name = sanitizeString(parsed.data.name, 100)
  if (parsed.data.description !== undefined) {
    data.description = parsed.data.description ? sanitizeString(parsed.data.description, 500) : null
  }

  await roleRepository.update(id, data)

  if (parsed.data.permissionIds) {
    const catalog = await getPermissionCatalog()
    const originalIds = before.rolePermissions.map((rp) => rp.permissionId)
    const preview = diffPermissionIds(originalIds, parsed.data.permissionIds, catalog)

    await roleRepository.setPermissions(id, parsed.data.permissionIds)

    if (preview.totalChanges > 0) {
      await logAudit({
        actorId: session?.user.id,
        entity: 'role_permission',
        entityId: id,
        action: 'permissions_update',
        before: { permissionIds: originalIds },
        after: {
          added: preview.added.map((p) => p.slug),
          removed: preview.removed.map((p) => p.slug),
        },
      })
    }
  }

  await logAudit({
    actorId: session?.user.id,
    entity: 'role',
    entityId: id,
    action: 'update',
    before: { name: before.name, slug: before.slug },
    after: parsed.data,
  })

  invalidateAllPermissionCache()
  revalidateRolePaths(id)
  return { success: true }
}

export async function deleteRoleAction(id: string): Promise<CrudActionResult> {
  await requirePermission('roles.delete')
  const session = await getSession()
  const role = await roleRepository.findById(id)
  if (!role) return { success: false, error: 'Role not found' }
  if (isSystemRole(role.slug)) {
    return { success: false, error: 'Cannot delete system role' }
  }

  await roleRepository.softDelete(id)

  await logAudit({
    actorId: session?.user.id,
    entity: 'role',
    entityId: id,
    action: 'delete',
    before: { slug: role.slug, name: role.name },
  })

  invalidateAllPermissionCache()
  revalidateRolePaths()
  return { success: true }
}

export async function bulkDeleteRolesAction(ids: string[]): Promise<CrudActionResult> {
  await requirePermission('roles.delete')
  const session = await getSession()

  const roles = await Promise.all(ids.map((id) => roleRepository.findById(id)))
  const deletable = roles.filter((r) => r && !isSystemRole(r.slug)).map((r) => r!.id)

  if (deletable.length === 0) {
    return { success: false, error: 'No deletable roles selected (system roles are protected)' }
  }

  await roleRepository.bulkSoftDelete(deletable)

  await logAudit({
    actorId: session?.user.id,
    entity: 'role',
    action: 'bulk_delete',
    after: { ids: deletable },
  })

  invalidateAllPermissionCache()
  revalidateRolePaths()
  return { success: true }
}

export async function duplicateRoleAction(id: string): Promise<CrudActionResult<{ id: string }>> {
  await requirePermission('roles.create')
  const session = await getSession()
  const role = await roleRepository.findById(id)
  if (!role) return { success: false, error: 'Role not found' }

  const baseSlug = `${role.slug}-copy`.slice(0, 44)
  let slug = baseSlug
  let attempt = 0
  while (await roleRepository.findBySlug(slug)) {
    attempt += 1
    slug = `${baseSlug}-${attempt}`.slice(0, 50)
  }

  const created = await roleRepository.create({
    slug,
    name: sanitizeString(`${role.name} (Copy)`, 100),
    description: role.description,
    createdById: session?.user.id,
  })

  const permissionIds = role.rolePermissions.map((rp) => rp.permissionId)
  if (permissionIds.length > 0) {
    await roleRepository.setPermissions(created.id, permissionIds)
  }

  await logAudit({
    actorId: session?.user.id,
    entity: 'role',
    entityId: created.id,
    action: 'duplicate',
    after: { sourceId: id, slug: created.slug },
  })

  invalidateAllPermissionCache()
  revalidateRolePaths(created.id)
  return { success: true, data: { id: created.id } }
}

export async function exportRoleAction(id: string): Promise<CrudActionResult<string>> {
  await requirePermission('roles.view')
  const role = await roleRepository.findById(id)
  if (!role) return { success: false, error: 'Role not found' }

  const payload = {
    slug: role.slug,
    name: role.name,
    description: role.description,
    permissions: role.rolePermissions.map((rp) => ({
      slug: rp.permission.slug,
      name: rp.permission.name,
      group: rp.permission.group,
    })),
    exportedAt: new Date().toISOString(),
  }

  return { success: true, data: JSON.stringify(payload, null, 2) }
}

export async function updateMatrixCellAction(
  roleId: string,
  permissionId: string,
  enabled: boolean
): Promise<CrudActionResult> {
  await requirePermission('roles.update')
  const role = await roleRepository.findById(roleId)
  if (!role) return { success: false, error: 'Role not found' }
  if (role.slug === 'superadmin') {
    return { success: false, error: 'Super Admin permissions cannot be modified' }
  }

  const currentIds = role.rolePermissions.map((rp) => rp.permissionId)
  const nextIds = enabled
    ? [...new Set([...currentIds, permissionId])]
    : currentIds.filter((id) => id !== permissionId)

  return updateRoleAction(roleId, { permissionIds: nextIds })
}

export async function previewUserRoleChangesAction(
  userId: string,
  nextRoleIds: string[]
): Promise<
  CrudActionResult<{
    addedPermissionCount: number
    removedPermissionCount: number
    isPrivilegeIncrease: boolean
  }>
> {
  await requirePermission('users.update')

  const { userRepository } = await import('@/modules/users/repositories')
  const targetUser = await userRepository.findById(userId)
  if (!targetUser) return { success: false, error: 'User not found' }

  const currentRoleIds = targetUser.userRoles.map((ur) => ur.role.id)
  const [currentPerms, nextPerms] = await Promise.all([
    getPermissionSlugsForRoles(currentRoleIds),
    getPermissionSlugsForRoles(nextRoleIds),
  ])

  if (currentPerms.has('*') || nextPerms.has('*')) {
    const isIncrease = !currentPerms.has('*') && nextPerms.has('*')
    return {
      success: true,
      data: {
        addedPermissionCount: isIncrease ? 999 : 0,
        removedPermissionCount: currentPerms.has('*') && !nextPerms.has('*') ? 999 : 0,
        isPrivilegeIncrease: isIncrease,
      },
    }
  }

  let added = 0
  let removed = 0
  for (const slug of nextPerms) {
    if (!currentPerms.has(slug)) added += 1
  }
  for (const slug of currentPerms) {
    if (!nextPerms.has(slug)) removed += 1
  }

  return {
    success: true,
    data: {
      addedPermissionCount: added,
      removedPermissionCount: removed,
      isPrivilegeIncrease: added > removed,
    },
  }
}

export async function validateSelfRoleChangeAction(
  userId: string,
  nextRoleIds: string[]
): Promise<CrudActionResult> {
  const session = await getSession()
  if (!session || session.user.id !== userId) {
    return { success: true }
  }

  const { userRepository } = await import('@/modules/users/repositories')
  const user = await userRepository.findById(userId)
  if (!user) return { success: false, error: 'User not found' }

  const currentRoleIds = user.userRoles.map((ur) => ur.role.id)
  const allRoles = await roleRepository.findAll()
  const adminRoleIds = allRoles
    .filter((r) => r.slug === 'superadmin' || r.slug === 'admin')
    .map((r) => r.id)

  const hadAdmin = currentRoleIds.some((id) => adminRoleIds.includes(id))
  const willHaveAdmin = nextRoleIds.some((id) => adminRoleIds.includes(id))

  if (hadAdmin && !willHaveAdmin) {
    return {
      success: false,
      error: 'You cannot remove your own admin access. Ask another administrator.',
    }
  }

  return { success: true }
}
