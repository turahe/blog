import { Suspense } from 'react'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { DataTable } from '@/components/admin/DataTable'
import { TableSkeleton } from '@/components/admin/Skeleton'
import { listCategories } from '@/modules/categories/services'
import { bulkDeleteCategoriesAction } from '@/modules/categories/actions'
import { can } from '@/lib/rbac'
import { getSession } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>
}

async function CategoriesTable({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>
}) {
  const session = await getSession()
  const canCreate = session ? await can('categories.create', session.user.id) : false
  const canDelete = session ? await can('categories.delete', session.user.id) : false

  const result = await listCategories({
    page: Number(searchParams.page) || 1,
    pageSize: Number(searchParams.pageSize) || 20,
    search: searchParams.search,
    sortBy: searchParams.sortBy,
    sortOrder: searchParams.sortOrder as 'asc' | 'desc',
  })

  const rows = result.data.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    posts: String(row.postCount),
    editHref: `/admin/categories/${row.id}`,
  }))

  return (
    <>
      {canCreate && (
        <div className="mb-4">
          <Link href="/admin/categories/new" className="admin-btn-primary">
            Create Category
          </Link>
        </div>
      )}
      <DataTable
        columns={[
          { key: 'name', label: 'Name', sortable: true },
          { key: 'slug', label: 'Slug', sortable: true },
          { key: 'posts', label: 'Posts' },
        ]}
        data={rows}
        total={result.total}
        page={result.page}
        pageSize={result.pageSize}
        rowHrefKey="editHref"
        bulkActions={
          canDelete ? [{ label: 'Delete Selected', action: bulkDeleteCategoriesAction }] : undefined
        }
      />
    </>
  )
}

export default async function CategoriesPage({ searchParams }: PageProps) {
  const params = await searchParams
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Categories' }]} />
      <AdminPageHeader title="Categories" description="Manage post categories." />
      <Suspense fallback={<TableSkeleton />}>
        <CategoriesTable searchParams={params} />
      </Suspense>
    </div>
  )
}
