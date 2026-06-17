import { Suspense } from 'react'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { DataTable } from '@/components/admin/DataTable'
import { TableSkeleton } from '@/components/admin/Skeleton'
import { listRoles } from '@/modules/roles/services'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>
}

async function RolesTable({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const result = await listRoles({
    page: Number(searchParams.page) || 1,
    pageSize: Number(searchParams.pageSize) || 20,
    search: searchParams.search,
    sortBy: searchParams.sortBy,
    sortOrder: searchParams.sortOrder as 'asc' | 'desc',
  })

  const rows = result.data.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    userCount: row.userCount,
    permissionCount: row.permissionCount,
    description: row.description ?? '—',
  }))

  return (
    <DataTable
      columns={[
        { key: 'slug', label: 'Slug', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'userCount', label: 'Users' },
        { key: 'permissionCount', label: 'Permissions' },
        { key: 'description', label: 'Description' },
      ]}
      data={rows}
      total={result.total}
      page={result.page}
      pageSize={result.pageSize}
    />
  )
}

export default async function RolesPage({ searchParams }: PageProps) {
  const params = await searchParams
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Roles' }]} />
      <AdminPageHeader title="Roles" description="View roles and their permission assignments." />
      <Suspense fallback={<TableSkeleton />}>
        <RolesTable searchParams={params} />
      </Suspense>
    </div>
  )
}
