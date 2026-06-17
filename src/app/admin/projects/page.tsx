import { Suspense } from 'react'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { DataTable } from '@/components/admin/DataTable'
import { TableSkeleton } from '@/components/admin/Skeleton'
import { listProjects } from '@/modules/projects/services'
import { bulkDeleteProjectsAction } from '@/modules/projects/actions'
import { can } from '@/lib/rbac'
import { getSession } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>
}

async function ProjectsTable({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>
}) {
  const session = await getSession()
  const canCreate = session ? await can('projects.create', session.user.id) : false
  const canDelete = session ? await can('projects.delete', session.user.id) : false

  const result = await listProjects({
    page: Number(searchParams.page) || 1,
    pageSize: Number(searchParams.pageSize) || 20,
    search: searchParams.search,
    sortBy: searchParams.sortBy,
    sortOrder: searchParams.sortOrder as 'asc' | 'desc',
  })

  const rows = result.data.map((row) => ({
    id: row.id,
    title: row.title,
    href: row.href,
    sortOrder: row.sortOrder,
    editHref: `/admin/projects/${row.id}`,
  }))

  return (
    <>
      {canCreate && (
        <div className="mb-4">
          <Link href="/admin/projects/new" className="admin-btn-primary">
            Create Project
          </Link>
        </div>
      )}
      <DataTable
        columns={[
          { key: 'title', label: 'Title', sortable: true },
          { key: 'href', label: 'URL' },
          { key: 'sortOrder', label: 'Order' },
        ]}
        data={rows}
        total={result.total}
        page={result.page}
        pageSize={result.pageSize}
        rowHrefKey="editHref"
        bulkActions={
          canDelete ? [{ label: 'Delete Selected', action: bulkDeleteProjectsAction }] : undefined
        }
      />
    </>
  )
}

export default async function ProjectsPage({ searchParams }: PageProps) {
  const params = await searchParams
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Projects' }]} />
      <AdminPageHeader title="Projects" description="Manage portfolio projects." />
      <Suspense fallback={<TableSkeleton />}>
        <ProjectsTable searchParams={params} />
      </Suspense>
    </div>
  )
}
