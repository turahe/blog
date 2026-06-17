import { Suspense } from 'react'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { DataTable } from '@/components/admin/DataTable'
import { TableSkeleton } from '@/components/admin/Skeleton'
import { listUsers } from '@/modules/users/services'
import { bulkDeleteUsersAction } from '@/modules/users/actions'
import { can } from '@/lib/rbac'
import { getSession } from '@/lib/auth/session'
import { formatDate } from '@/lib/formatDate'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>
}

async function UsersTable({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const session = await getSession()
  const canCreate = session ? await can('users.create', session.user.id) : false
  const canDelete = session ? await can('users.delete', session.user.id) : false

  const result = await listUsers({
    page: Number(searchParams.page) || 1,
    pageSize: Number(searchParams.pageSize) || 20,
    search: searchParams.search,
    sortBy: searchParams.sortBy,
    sortOrder: searchParams.sortOrder as 'asc' | 'desc',
    filters: searchParams.status ? { status: searchParams.status } : undefined,
  })

  const rows = result.data.map((row) => ({
    id: row.id,
    email: row.email,
    fullName: row.fullName,
    status: row.status,
    roles: row.roles.join(', ') || '—',
    lastLoginAt: row.lastLoginAt ? formatDate(row.lastLoginAt.toISOString()) : '—',
    editHref: `/admin/users/${row.id}`,
  }))

  return (
    <>
      {canCreate && (
        <div className="mb-4 flex flex-wrap gap-3">
          <Link href="/admin/users/new" className="admin-btn-primary">
            Create User
          </Link>
        </div>
      )}
      <DataTable
        columns={[
          { key: 'email', label: 'Email', sortable: true },
          { key: 'fullName', label: 'Name', sortable: true },
          { key: 'status', label: 'Status', sortable: true, variant: 'badge' },
          { key: 'roles', label: 'Roles' },
          { key: 'lastLoginAt', label: 'Last Login' },
        ]}
        data={rows}
        total={result.total}
        page={result.page}
        pageSize={result.pageSize}
        rowHrefKey="editHref"
        bulkActions={
          canDelete ? [{ label: 'Delete Selected', action: bulkDeleteUsersAction }] : undefined
        }
      />
    </>
  )
}

export default async function UsersPage({ searchParams }: PageProps) {
  const params = await searchParams
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Users' }]} />
      <AdminPageHeader title="Users" description="Manage user accounts and role assignments." />
      <Suspense fallback={<TableSkeleton />}>
        <UsersTable searchParams={params} />
      </Suspense>
    </div>
  )
}
