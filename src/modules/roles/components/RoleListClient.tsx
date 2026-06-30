'use client'

import Link from 'next/link'
import { DataTable } from '@/components/admin/DataTable'
import { RoleScopeFilter } from './RoleScopeFilter'
import { bulkDeleteRolesAction } from '../actions'

type RoleRow = {
  id: string
  slug: string
  name: string
  description: string
  userCount: number
  permissionCount: number
  scope: string
  updatedAt: string
  detailHref: string
  editHref: string
}

interface RoleListClientProps {
  rows: RoleRow[]
  total: number
  page: number
  pageSize: number
  canDelete: boolean
}

export function RoleListClient({ rows, total, page, pageSize, canDelete }: RoleListClientProps) {
  const exportCsv = () => {
    const header = ['name', 'slug', 'users', 'permissions', 'scope', 'updatedAt']
    const lines = rows.map((r) =>
      [r.name, r.slug, r.userCount, r.permissionCount, r.scope, r.updatedAt]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    )
    const csv = [header.join(','), ...lines].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'roles.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <DataTable
      columns={[
        { key: 'name', label: 'Role Name', sortable: true },
        { key: 'description', label: 'Description' },
        { key: 'userCount', label: 'Assigned Users', sortable: true },
        { key: 'permissionCount', label: 'Permission Count', sortable: true },
        { key: 'scope', label: 'Scope', variant: 'badge' },
        { key: 'updatedAt', label: 'Updated At', sortable: true },
      ]}
      data={rows}
      total={total}
      page={page}
      pageSize={pageSize}
      searchPlaceholder="Search roles…"
      rowLinkKey="detailHref"
      rowHrefKey="editHref"
      rowLinkLabel="Open"
      emptyMessage="No roles created"
      toolbarExtra={<RoleScopeFilter />}
      bulkActions={
        canDelete
          ? [
              {
                label: 'Delete selected',
                action: bulkDeleteRolesAction,
              },
            ]
          : undefined
      }
      exportCsv={exportCsv}
    />
  )
}

export function RoleListHeaderActions() {
  return (
    <>
      <Link href="/admin/roles/matrix" className="admin-btn-secondary">
        Permission matrix
      </Link>
      <Link href="/admin/roles/new" className="admin-btn-primary">
        Create role
      </Link>
    </>
  )
}
