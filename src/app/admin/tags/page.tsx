import { Suspense } from 'react'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { DataTable } from '@/components/admin/DataTable'
import { TableSkeleton } from '@/components/admin/Skeleton'
import { listTags } from '@/modules/tags/services'
import { bulkDeleteTagsAction } from '@/modules/tags/actions'
import { can } from '@/lib/rbac'
import { getSession } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>
}

async function TagsTable({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const session = await getSession()
  const canCreate = session ? await can('tags.create', session.user.id) : false
  const canDelete = session ? await can('tags.delete', session.user.id) : false

  const result = await listTags({
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
    editHref: `/admin/tags/${row.id}`,
  }))

  return (
    <>
      {canCreate && (
        <div className="mb-4">
          <Link href="/admin/tags/new" className="admin-btn-primary">
            Create Tag
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
          canDelete ? [{ label: 'Delete Selected', action: bulkDeleteTagsAction }] : undefined
        }
      />
    </>
  )
}

export default async function TagsPage({ searchParams }: PageProps) {
  const params = await searchParams
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Tags' }]} />
      <AdminPageHeader title="Tags" description="Manage post tags." />
      <Suspense fallback={<TableSkeleton />}>
        <TagsTable searchParams={params} />
      </Suspense>
    </div>
  )
}
