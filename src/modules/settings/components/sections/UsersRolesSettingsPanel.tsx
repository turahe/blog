'use client'

import Link from 'next/link'
import { SettingsCard } from '@/components/admin/settings/SettingsCard'
import type { RolePermissionMatrix } from '@/modules/settings/types'

const MATRIX_ROWS = [
  { slug: 'posts.create', label: 'Create post' },
  { slug: 'posts.update', label: 'Edit post' },
  { slug: 'posts.update', label: 'Publish post' },
  { slug: 'posts.delete', label: 'Delete post' },
  { slug: 'users.update', label: 'Manage users' },
  { slug: 'settings.update', label: 'Manage settings' },
] as const

const DISPLAY_ROLES = ['admin', 'operator', 'user']

export function UsersRolesSettingsPanel({ roles }: { roles: RolePermissionMatrix[] }) {
  const visibleRoles = roles.filter(
    (r) => DISPLAY_ROLES.includes(r.slug) || r.slug === 'superadmin'
  )

  return (
    <>
      <SettingsCard
        title="Roles overview"
        description="Permission matrix for common editorial roles. Manage users and roles in dedicated admin pages."
      >
        <div className="mb-4 flex flex-wrap gap-3">
          <Link href="/admin/users" className="admin-btn-secondary">
            Manage users
          </Link>
          <Link href="/admin/roles" className="admin-btn-secondary">
            Manage roles
          </Link>
          <Link href="/admin/roles/matrix" className="admin-btn-secondary">
            Permission matrix
          </Link>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase dark:bg-gray-900/60 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3 font-medium">Permission</th>
                {visibleRoles.map((role) => (
                  <th key={role.id} className="px-4 py-3 font-medium">
                    {role.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MATRIX_ROWS.map((row, idx) => (
                <tr
                  key={`${row.slug}-${idx}`}
                  className="border-t border-gray-100 dark:border-gray-800"
                >
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">
                    {row.label}
                  </td>
                  {visibleRoles.map((role) => {
                    const allowed =
                      role.permissions.includes(row.slug) || role.slug === 'superadmin'
                    return (
                      <td key={role.id} className="px-4 py-3">
                        <span
                          className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                            allowed
                              ? 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400'
                              : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                          }`}
                        >
                          {allowed ? '✓' : '—'}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsCard>

      <SettingsCard title="Role descriptions">
        <dl className="space-y-4">
          {visibleRoles.map((role) => (
            <div key={role.id}>
              <dt className="font-medium text-gray-900 dark:text-white/90">{role.name}</dt>
              <dd className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {role.permissions.length} permissions assigned
              </dd>
            </div>
          ))}
        </dl>
      </SettingsCard>
    </>
  )
}
