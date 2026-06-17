import prisma from '@/lib/db/prisma'
import type { Prisma, User, UserStatus } from '@/lib/db/prisma'
import type { ListQueryParams, PaginatedResult } from '@/lib/crud/types'
import { parseListQuery, paginate } from '@/lib/crud/types'

export type UserListItem = Pick<
  User,
  'id' | 'email' | 'fullName' | 'avatar' | 'status' | 'lastLoginAt' | 'createdAt'
> & { roles: string[] }

const userSelect = {
  id: true,
  email: true,
  fullName: true,
  avatar: true,
  status: true,
  lastLoginAt: true,
  createdAt: true,
  userRoles: { include: { role: { select: { slug: true, name: true } } } },
} satisfies Prisma.UserSelect

export const userRepository = {
  async findMany(params: ListQueryParams): Promise<PaginatedResult<UserListItem>> {
    const q = parseListQuery(params, { sortBy: 'createdAt' })
    const where: Prisma.UserWhereInput = { deletedAt: null }

    if (q.search) {
      where.OR = [{ email: { contains: q.search } }, { fullName: { contains: q.search } }]
    }

    if (q.filters?.status) {
      where.status = q.filters.status as UserStatus
    }

    const orderBy: Prisma.UserOrderByWithRelationInput = {}
    if (
      q.sortBy === 'email' ||
      q.sortBy === 'fullName' ||
      q.sortBy === 'status' ||
      q.sortBy === 'createdAt'
    ) {
      orderBy[q.sortBy] = q.sortOrder
    } else {
      orderBy.createdAt = 'desc'
    }

    const [rows, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: userSelect,
        orderBy,
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
      }),
      prisma.user.count({ where }),
    ])

    const data = rows.map((u) => ({
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      avatar: u.avatar,
      status: u.status,
      lastLoginAt: u.lastLoginAt,
      createdAt: u.createdAt,
      roles: u.userRoles.map((ur) => ur.role.slug),
    }))

    return paginate(data, total, q.page, q.pageSize)
  },

  async findById(id: string) {
    return prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatar: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        userRoles: {
          include: { role: { select: { id: true, slug: true, name: true } } },
        },
      },
    })
  },

  async findByEmail(email: string) {
    return prisma.user.findFirst({ where: { email, deletedAt: null } })
  },

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data })
  },

  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data })
  },

  async softDelete(id: string, updatedById?: string) {
    return prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById },
    })
  },

  async bulkSoftDelete(ids: string[], updatedById?: string) {
    return prisma.user.updateMany({
      where: { id: { in: ids }, deletedAt: null },
      data: { deletedAt: new Date(), updatedById },
    })
  },

  async countActive(): Promise<number> {
    return prisma.user.count({ where: { deletedAt: null, status: 'ACTIVE' } })
  },

  async setRoles(userId: string, roleIds: string[]) {
    await prisma.userRole.deleteMany({ where: { userId } })
    if (roleIds.length > 0) {
      await prisma.userRole.createMany({
        data: roleIds.map((roleId) => ({ userId, roleId })),
      })
    }
  },
}
