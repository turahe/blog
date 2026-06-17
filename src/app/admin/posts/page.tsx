import { Suspense } from 'react'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { DataTable } from '@/components/admin/DataTable'
import { TableSkeleton } from '@/components/admin/Skeleton'
import { listPosts } from '@/modules/posts/services'
import { bulkDeletePostsAction } from '@/modules/posts/actions'
import { can } from '@/lib/rbac'
import { getSession } from '@/lib/auth/session'
import { formatDate } from '@/lib/formatDate'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>
}

async function PostsTable({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const session = await getSession()
  const canCreate = session ? await can('posts.create', session.user.id) : false
  const canDelete = session ? await can('posts.delete', session.user.id) : false

  const result = await listPosts({
    page: Number(searchParams.page) || 1,
    pageSize: Number(searchParams.pageSize) || 20,
    search: searchParams.search,
    sortBy: searchParams.sortBy,
    sortOrder: searchParams.sortOrder as 'asc' | 'desc',
    filters: searchParams.draft ? { draft: searchParams.draft } : undefined,
  })

  const rows = result.data.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    draft: row.draft ? 'Yes' : 'No',
    date: formatDate(row.date.toISOString()),
    category: row.category ?? '—',
    tags: String(row.tagCount),
    editHref: `/admin/posts/${row.id}`,
  }))

  return (
    <>
      {canCreate && (
        <div className="mb-4">
          <Link href="/admin/posts/new" className="admin-btn-primary">
            Create Post
          </Link>
        </div>
      )}
      <DataTable
        columns={[
          { key: 'title', label: 'Title', sortable: true },
          { key: 'slug', label: 'Slug', sortable: true },
          { key: 'draft', label: 'Draft', variant: 'badge' },
          { key: 'date', label: 'Date', sortable: true },
          { key: 'category', label: 'Category' },
          { key: 'tags', label: 'Tags' },
        ]}
        data={rows}
        total={result.total}
        page={result.page}
        pageSize={result.pageSize}
        rowHrefKey="editHref"
        bulkActions={
          canDelete ? [{ label: 'Delete Selected', action: bulkDeletePostsAction }] : undefined
        }
      />
    </>
  )
}

export default async function PostsPage({ searchParams }: PageProps) {
  const params = await searchParams
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Posts' }]} />
      <AdminPageHeader title="Posts" description="Manage blog posts and content." />
      <Suspense fallback={<TableSkeleton />}>
        <PostsTable searchParams={params} />
      </Suspense>
    </div>
  )
}
