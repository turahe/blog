import prisma from '@/lib/db/prisma'
import type { Prisma } from '@/lib/db/prisma'
import type { ListQueryParams, PaginatedResult } from '@/lib/crud/types'
import { parseListQuery, paginate } from '@/lib/crud/types'

export const roleRepository = {
  async findMany(params: ListQueryParams): Promise<
    PaginatedResult<{
      id: string
      slug: string
      name: string
      description: string | null
      userCount: number
      permissionCount: number
      createdAt: Date
    }>
  > {
    const q = parseListQuery(params, { sortBy: 'name' })
    const where: Prisma.RoleWhereInput = { deletedAt: null }

    if (q.search) {
      where.OR = [{ name: { contains: q.search } }, { slug: { contains: q.search } }]
    }

    const [rows, total] = await Promise.all([
      prisma.role.findMany({
        where,
        orderBy: { [q.sortBy === 'slug' ? 'slug' : 'name']: q.sortOrder },
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
      createdAt: r.createdAt,
    }))

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

  async findAll() {
    return prisma.role.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
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

  async setPermissions(roleId: string, permissionIds: string[]) {
    await prisma.rolePermission.deleteMany({ where: { roleId } })
    if (permissionIds.length > 0) {
      await prisma.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({ roleId, permissionId })),
      })
    }
  },
}
