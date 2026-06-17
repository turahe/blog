import { Suspense } from 'react'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { DataTable } from '@/components/admin/DataTable'
import { TableSkeleton } from '@/components/admin/Skeleton'
import { experienceRepository } from '@/repositories/index'

export const dynamic = 'force-dynamic'

async function ExperienceTable() {
  const items = await experienceRepository.findAll()

  const rows = items.map((row) => ({
    id: row.id,
    title: row.title,
    company: row.company,
    location: row.location,
    range: row.range,
    sortOrder: row.sortOrder,
  }))

  return (
    <DataTable
      columns={[
        { key: 'title', label: 'Title', sortable: true },
        { key: 'company', label: 'Company', sortable: true },
        { key: 'location', label: 'Location' },
        { key: 'range', label: 'Period' },
        { key: 'sortOrder', label: 'Order' },
      ]}
      data={rows}
      total={rows.length}
      page={1}
      pageSize={Math.max(rows.length, 20)}
    />
  )
}

export default function ExperiencePage() {
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Experience' }]} />
      <AdminPageHeader title="Experience" description="Work history shown on the About page." />
      <Suspense fallback={<TableSkeleton />}>
        <ExperienceTable />
      </Suspense>
    </div>
  )
}
