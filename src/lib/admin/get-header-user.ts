import prisma from '@/lib/db/prisma'
import { formatDateUtc } from '@/lib/formatDate'
import type { SessionUser } from '@/lib/auth/session'

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

const USER_SHELL_ROLE_SELECT = {
  where: { role: { deletedAt: null } },
  include: {
    role: {
      select: {
        name: true,
        slug: true,
        deletedAt: true,
        rolePermissions: {
          include: { permission: { select: { slug: true } } },
        },
      },
    },
  },
  orderBy: { role: { name: 'asc' as const } },
} as const

export const USER_SHELL_SELECT = {
  lastLoginAt: true,
  createdAt: true,
  userRoles: USER_SHELL_ROLE_SELECT,
} as const

const ADMIN_USER_PROFILE_SELECT = {
  id: true,
  fullName: true,
  email: true,
  avatar: true,
  ...USER_SHELL_SELECT,
} as const

type UserShellProfile = {
  lastLoginAt: Date | null
  createdAt: Date
  userRoles: {
    role: {
      name: string
      slug: string
      deletedAt: Date | null
      rolePermissions: { permission: { slug: string } }[]
    }
  }[]
}

type UserIdentity = Pick<SessionUser, 'id' | 'fullName' | 'email' | 'avatar'>

export function buildAdminHeaderUser(
  identity: UserIdentity,
  profile: UserShellProfile
): AdminHeaderUser {
  const roleNames = profile.userRoles.map((ur) => ur.role.name)
  const primaryRole = roleNames[0] ?? 'Member'
  const memberSince = profile.createdAt.toISOString()

  return {
    id: identity.id,
    fullName: identity.fullName,
    email: identity.email,
    avatar: identity.avatar,
    primaryRole,
    lastLoginAt: profile.lastLoginAt?.toISOString() ?? null,
    lastLoginLabel: profile.lastLoginAt ? formatDateUtc(profile.lastLoginAt.toISOString()) : null,
    memberSince,
    memberSinceLabel: formatDateUtc(memberSince),
  }
}

export async function loadUserShellProfile(userId: string): Promise<UserShellProfile | null> {
  return prisma.user.findUnique({
    where: { id: userId },
    select: USER_SHELL_SELECT,
  })
}

export async function getAdminHeaderUserForSession(session: {
  user: SessionUser
}): Promise<AdminHeaderUser | null> {
  const profile = await loadUserShellProfile(session.user.id)
  if (!profile) return null
  return buildAdminHeaderUser(session.user, profile)
}

export async function getAdminHeaderUser(userId: string): Promise<AdminHeaderUser | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: ADMIN_USER_PROFILE_SELECT,
  })

  if (!user) return null
  return buildAdminHeaderUser(user, user)
}
