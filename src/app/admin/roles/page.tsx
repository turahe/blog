import { Suspense } from 'react'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { TableSkeleton } from '@/components/admin/Skeleton'
import { RoleListClient, RoleListHeaderActions } from '@/modules/roles/components/RoleListClient'
import { listRoles } from '@/modules/roles/services'
import { can } from '@/lib/rbac'
import { getSession } from '@/lib/auth/session'
import { formatDate } from '@/lib/formatDate'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>
}

async function RolesTable({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const session = await getSession()
  const canDelete = session ? await can('roles.delete', session.user.id) : false

  const result = await listRoles({
    page: Number(searchParams.page) || 1,
    pageSize: Number(searchParams.pageSize) || 20,
    search: searchParams.search,
    sortBy: searchParams.sortBy,
    sortOrder: searchParams.sortOrder as 'asc' | 'desc',
    filters: searchParams.scope ? { scope: searchParams.scope } : undefined,
  })

  const rows = result.data.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? '—',
    userCount: row.userCount,
    permissionCount: row.permissionCount,
    scope: row.scope === 'system' ? 'System' : 'Custom',
    updatedAt: formatDate(row.updatedAt.toISOString()),
    detailHref: `/admin/roles/${row.id}`,
    editHref: `/admin/roles/${row.id}`,
  }))

  return (
    <RoleListClient
      rows={rows}
      total={result.total}
      page={result.page}
      pageSize={result.pageSize}
      canDelete={canDelete}
    />
  )
}

export default async function RolesPage({ searchParams }: PageProps) {
  const params = await searchParams
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Roles' }]} />
      <AdminPageHeader
        title="Role Management"
        description="Manage roles, permissions, and access policies."
        actions={<RoleListHeaderActions />}
      />
      <Suspense fallback={<TableSkeleton />}>
        <RolesTable searchParams={params} />
      </Suspense>
    </div>
  )
}
