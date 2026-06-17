import { Suspense } from 'react'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { DataTable } from '@/components/admin/DataTable'
import { TableSkeleton } from '@/components/admin/Skeleton'
import { listPermissions } from '@/modules/permissions/services'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>
}

async function PermissionsTable({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>
}) {
  const result = await listPermissions({
    page: Number(searchParams.page) || 1,
    pageSize: Number(searchParams.pageSize) || 50,
    search: searchParams.search,
    sortBy: searchParams.sortBy,
    sortOrder: searchParams.sortOrder as 'asc' | 'desc',
    filters: searchParams.group ? { group: searchParams.group } : undefined,
  })

  return (
    <DataTable
      columns={[
        { key: 'slug', label: 'Permission', sortable: true },
        { key: 'name', label: 'Name' },
        { key: 'group', label: 'Group' },
        { key: 'roleCount', label: 'Roles' },
      ]}
      data={result.data}
      total={result.total}
      page={result.page}
      pageSize={result.pageSize}
    />
  )
}

export default async function PermissionsPage({ searchParams }: PageProps) {
  const params = await searchParams
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Permissions' }]} />
      <AdminPageHeader
        title="Permissions"
        description="Browse the permission catalog used by RBAC."
      />
      <Suspense fallback={<TableSkeleton />}>
        <PermissionsTable searchParams={params} />
      </Suspense>
    </div>
  )
}
