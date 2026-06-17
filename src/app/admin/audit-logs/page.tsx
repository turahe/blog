import { Suspense } from 'react'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { DataTable } from '@/components/admin/DataTable'
import { TableSkeleton } from '@/components/admin/Skeleton'
import prisma from '@/lib/db/prisma'
import { parseListQuery, paginate } from '@/lib/crud/types'
import { formatDate } from '@/lib/formatDate'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>
}

async function AuditLogsTable({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>
}) {
  const q = parseListQuery({
    page: Number(searchParams.page) || 1,
    pageSize: Number(searchParams.pageSize) || 20,
    search: searchParams.search,
    sortOrder: 'desc',
    sortBy: 'createdAt',
  })

  const where = q.search
    ? {
        OR: [{ entity: { contains: q.search } }, { action: { contains: q.search } }],
      }
    : {}

  const [rows, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (q.page - 1) * q.pageSize,
      take: q.pageSize,
      include: { actor: { select: { email: true, fullName: true } } },
    }),
    prisma.auditLog.count({ where }),
  ])

  const data = rows.map((log) => ({
    id: log.id,
    actor: log.actor?.email ?? 'system',
    entity: log.entity,
    entityId: log.entityId ?? '—',
    action: log.action,
    createdAt: formatDate(log.createdAt.toISOString()),
  }))

  const result = paginate(data, total, q.page, q.pageSize)

  return (
    <DataTable
      columns={[
        { key: 'createdAt', label: 'Time' },
        { key: 'actor', label: 'Actor' },
        { key: 'action', label: 'Action' },
        { key: 'entity', label: 'Entity' },
        { key: 'entityId', label: 'Entity ID' },
      ]}
      data={result.data}
      total={result.total}
      page={result.page}
      pageSize={result.pageSize}
    />
  )
}

export default async function AuditLogsPage({ searchParams }: PageProps) {
  const params = await searchParams
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Audit Logs' }]} />
      <AdminPageHeader
        title="Audit Logs"
        description="Review administrative actions and changes."
      />
      <Suspense fallback={<TableSkeleton />}>
        <AuditLogsTable searchParams={params} />
      </Suspense>
    </div>
  )
}
