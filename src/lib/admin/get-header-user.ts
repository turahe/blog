import prisma from '@/lib/db/prisma'
import { formatDateUtc } from '@/lib/formatDate'

export interface AdminHeaderUser {
  id: string
  fullName: string
  email: string
  avatar: string | null
  primaryRole: string
  lastLoginAt: string | null
  lastLoginLabel: string | null
  memberSince: string
  memberSinceLabel: string
}

export async function getAdminHeaderUser(userId: string): Promise<AdminHeaderUser | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      avatar: true,
      lastLoginAt: true,
      createdAt: true,
      userRoles: {
        where: { role: { deletedAt: null } },
        include: { role: { select: { name: true } } },
        orderBy: { role: { name: 'asc' } },
      },
    },
  })

  if (!user) return null

  const roleNames = user.userRoles.map((ur) => ur.role.name)
  const primaryRole = roleNames[0] ?? 'Member'
  const memberSince = user.createdAt.toISOString()

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    avatar: user.avatar,
    primaryRole,
    lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
    lastLoginLabel: user.lastLoginAt ? formatDateUtc(user.lastLoginAt.toISOString()) : null,
    memberSince,
    memberSinceLabel: formatDateUtc(memberSince),
  }
}
