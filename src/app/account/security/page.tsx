import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { getAccountHeader, getAccountSecurityOverview } from '@/modules/account/services'
import { AccountShell } from '@/components/account/AccountShell'
import { SecurityPanels } from '@/components/account/SecurityPanels'

async function SecurityPageContent() {
  const session = await getSession()
  if (!session) redirect('/login')

  const [header, overview] = await Promise.all([
    getAccountHeader(session.user.id),
    getAccountSecurityOverview(session.user.id),
  ])
  if (!header || !overview) redirect('/login')

  return (
    <AccountShell
      header={header}
      title="Security"
      description="Password, two-factor authentication, and account security overview."
    >
      <SecurityPanels overview={overview} />
    </AccountShell>
  )
}

export default function AccountSecurityPage() {
  return (
    <Suspense
      fallback={<div className="h-96 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />}
    >
      <SecurityPageContent />
    </Suspense>
  )
}
