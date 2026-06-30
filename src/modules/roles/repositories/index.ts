import prisma from '@/lib/db/prisma'
import type { Prisma } from '@/lib/db/prisma'
import type { ListQueryParams, PaginatedResult } from '@/lib/crud/types'
import { parseListQuery, paginate } from '@/lib/crud/types'
import { isSystemRole } from '../constants'

export const roleRepository = {
  async findMany(params: ListQueryParams): Promise<
    PaginatedResult<{
      id: string
      slug: string
      name: string
      description: string | null
      userCount: number
      permissionCount: number
      scope: 'system' | 'custom'
      updatedAt: Date
      createdAt: Date
    }>
  > {
    const q = parseListQuery(params, { sortBy: 'name' })
    const where: Prisma.RoleWhereInput = { deletedAt: null }

    if (q.search) {
      where.OR = [
        { name: { contains: q.search } },
        { slug: { contains: q.search } },
        { description: { contains: q.search } },
      ]
    }

    const scopeFilter = q.filters?.scope
    if (scopeFilter === 'system') {
      where.slug = { in: ['superadmin', 'admin', 'operator', 'user'] }
    } else if (scopeFilter === 'custom') {
      where.slug = { notIn: ['superadmin', 'admin', 'operator', 'user'] }
    }

    const sortField =
      q.sortBy === 'updatedAt'
        ? 'updatedAt'
        : q.sortBy === 'slug'
          ? 'slug'
          : q.sortBy === 'permissionCount' || q.sortBy === 'userCount'
            ? 'name'
            : 'name'

    const [rows, total] = await Promise.all([
      prisma.role.findMany({
        where,
        orderBy: { [sortField]: q.sortOrder },
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
        include: {
          _count: { select: { userRoles: true, rolePermissions: true } },
        },
      }),
      prisma.role.count({ where }),
    ])

    const data = rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      name: r.name,
      description: r.description,
      userCount: r._count.userRoles,
      permissionCount: r._count.rolePermissions,
      scope: isSystemRole(r.slug) ? ('system' as const) : ('custom' as const),
      updatedAt: r.updatedAt,
      createdAt: r.createdAt,
    }))

    if (q.sortBy === 'permissionCount' || q.sortBy === 'userCount') {
      const key = q.sortBy
      data.sort((a, b) => {
        const diff = a[key] - b[key]
        return q.sortOrder === 'asc' ? diff : -diff
      })
    }

    return paginate(data, total, q.page, q.pageSize)
  },

  async findById(id: string) {
    return prisma.role.findFirst({
      where: { id, deletedAt: null },
      include: {
        rolePermissions: { include: { permission: true } },
        _count: { select: { userRoles: true } },
      },
    })
  },

  async findBySlug(slug: string) {
    return prisma.role.findFirst({
      where: { slug, deletedAt: null },
    })
  },

  async findAll() {
    return prisma.role.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    })
  },

  async findAllWithPermissions() {
    return prisma.role.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
      include: {
        rolePermissions: { include: { permission: { select: { id: true, slug: true } } } },
      },
    })
  },

  async create(data: Prisma.RoleCreateInput) {
    return prisma.role.create({ data })
  },

  async update(id: string, data: Prisma.RoleUpdateInput) {
    return prisma.role.update({ where: { id }, data })
  },

  async softDelete(id: string) {
    return prisma.role.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  },

  async bulkSoftDelete(ids: string[]) {
    if (ids.length === 0) return
    await prisma.role.updateMany({
      where: { id: { in: ids }, deletedAt: null },
      data: { deletedAt: new Date() },
    })
  },

  async setPermissions(roleId: string, permissionIds: string[]) {
    await prisma.rolePermission.deleteMany({ where: { roleId } })
    if (permissionIds.length > 0) {
      await prisma.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({ roleId, permissionId })),
      })
    }
  },

  async listAuditLogs(roleId: string, limit = 50) {
    return prisma.auditLog.findMany({
      where: {
        OR: [
          { entity: 'role', entityId: roleId },
          { entity: 'role_permission', entityId: roleId },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { actor: { select: { fullName: true, email: true } } },
    })
  },
}
