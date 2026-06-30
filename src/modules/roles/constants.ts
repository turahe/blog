export const SYSTEM_ROLE_SLUGS = ['superadmin', 'admin', 'operator', 'user'] as const

export type SystemRoleSlug = (typeof SYSTEM_ROLE_SLUGS)[number]

export function isSystemRole(slug: string): boolean {
  return (SYSTEM_ROLE_SLUGS as readonly string[]).includes(slug)
}
