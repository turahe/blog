import { Suspense } from 'react'
import {
  UsersIcon,
  UserGroupIcon,
  ChartBarIcon,
  ServerStackIcon,
  CircleStackIcon,
} from '@heroicons/react/24/outline'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { StatCard } from '@/components/admin/StatCard'
import { CardSkeleton } from '@/components/admin/Skeleton'
import { getActiveUserCount, getTotalUserCount } from '@/modules/users/services'
import { getDailyActiveUsers, getRequestCountSince } from '@/lib/monitoring/health'
import prisma from '@/lib/db/prisma'

export const dynamic = 'force-dynamic'

async function DashboardStats() {
  const since = new Date()
  since.setHours(0, 0, 0, 0)

  const [totalUsers, activeUsers, dailyActive, apiRequests, tableCount] = await Promise.all([
    getTotalUserCount(),
    getActiveUserCount(),
    getDailyActiveUsers(),
    getRequestCountSince(since),
    prisma.$queryRaw<
      [{ count: bigint }]
    >`SELECT COUNT(*)::bigint as count FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`,
  ])

  const dbTables = Number(tableCount[0]?.count ?? 0)

  const widgets = [
    { label: 'Total Users', value: totalUsers, icon: <UsersIcon className="h-6 w-6" /> },
    { label: 'Active Users', value: activeUsers, icon: <UserGroupIcon className="h-6 w-6" /> },
    { label: 'Daily Active Users', value: dailyActive, icon: <ChartBarIcon className="h-6 w-6" /> },
    {
      label: 'API Requests (today)',
      value: apiRequests,
      icon: <ServerStackIcon className="h-6 w-6" />,
    },
    { label: 'Database Tables', value: dbTables, icon: <CircleStackIcon className="h-6 w-6" /> },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {widgets.map((w) => (
        <StatCard key={w.label} label={w.label} value={w.value} icon={w.icon} />
      ))}
    </div>
  )
}

export default function AdminOverviewPage() {
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard' }]} />
      <AdminPageHeader
        title="Dashboard"
        description="Overview of users, activity, and system health."
      />
      <Suspense
        fallback={
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <DashboardStats />
      </Suspense>
    </div>
  )
}
