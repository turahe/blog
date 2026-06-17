import { Suspense } from 'react'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { DataTable } from '@/components/admin/DataTable'
import { TableSkeleton } from '@/components/admin/Skeleton'
import { listCommentsAdmin } from '@/modules/comments/services'
import { bulkDeleteCommentsAction, bulkModerateCommentsAction } from '@/modules/comments/actions'
import { can } from '@/lib/rbac'
import { getSession } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>
}

async function CommentsTable({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>
}) {
  const session = await getSession()
  const canModerate = session ? await can('comments.moderate', session.user.id) : false
  const canDelete = session ? await can('comments.delete', session.user.id) : false

  const result = await listCommentsAdmin({
    page: Number(searchParams.page) || 1,
    pageSize: Number(searchParams.pageSize) || 20,
    search: searchParams.search,
    sortBy: searchParams.sortBy,
    sortOrder: searchParams.sortOrder as 'asc' | 'desc',
    filters: searchParams.status ? { status: searchParams.status } : undefined,
  })

  const rows = result.data.map((row) => ({
    id: row.id,
    post: row.postTitle,
    author: row.authorName,
    status: row.status,
    excerpt: row.content.length > 80 ? `${row.content.slice(0, 80)}…` : row.content,
    created: new Date(row.createdAt).toLocaleString(),
    postLink: `/blog/${row.postSlug}`,
  }))

  return (
    <DataTable
      columns={[
        { key: 'post', label: 'Post' },
        { key: 'author', label: 'Author', sortable: true },
        { key: 'status', label: 'Status', sortable: true, variant: 'badge' },
        { key: 'excerpt', label: 'Comment' },
        { key: 'created', label: 'Created', sortable: true },
      ]}
      data={rows}
      total={result.total}
      page={result.page}
      pageSize={result.pageSize}
      bulkActions={[
        ...(canModerate
          ? [
              {
                label: 'Approve Selected',
                action: (ids: string[]) => bulkModerateCommentsAction(ids, 'APPROVED'),
              },
              {
                label: 'Mark Spam',
                action: (ids: string[]) => bulkModerateCommentsAction(ids, 'SPAM'),
              },
            ]
          : []),
        ...(canDelete ? [{ label: 'Delete Selected', action: bulkDeleteCommentsAction }] : []),
      ]}
      rowHrefKey="postLink"
      rowLinkLabel="View post"
    />
  )
}

export default async function CommentsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const session = await getSession()
  const canModerate = session ? await can('comments.moderate', session.user.id) : false

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Comments' }]} />
      <AdminPageHeader
        title="Comments"
        description="Moderate reader comments stored in the database."
      />
      {canModerate && (
        <div className="mb-4 flex flex-wrap gap-2">
          <Link href="/admin/comments?status=PENDING" className="admin-btn-secondary">
            Pending
          </Link>
          <Link href="/admin/comments?status=APPROVED" className="admin-btn-secondary">
            Approved
          </Link>
          <Link href="/admin/comments?status=SPAM" className="admin-btn-secondary">
            Spam
          </Link>
          <Link href="/admin/comments" className="admin-btn-secondary">
            All
          </Link>
        </div>
      )}
      <Suspense fallback={<TableSkeleton />}>
        <CommentsTable searchParams={params} />
      </Suspense>
    </div>
  )
}
