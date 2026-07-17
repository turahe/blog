import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { AccountShell } from '@/components/account/AccountShell'
import { SessionsPanel } from '@/components/account/SessionsPanel'
import { getSession } from '@/lib/auth/session'
import { getAccountHeader, getAccountSessions } from '@/modules/account/services'

async function SessionsPageContent() {
  const session = await getSession()
  if (!session) redirect('/login')

  const [header, sessions] = await Promise.all([
    getAccountHeader(session.user.id),
    getAccountSessions(session.user.id, session.sessionId),
  ])
  if (!header) redirect('/login')

  return (
    <AccountShell
      header={header}
      title="Active sessions"
      description="Review and revoke devices signed in to your account."
    >
      <SessionsPanel sessions={sessions} />
    </AccountShell>
  )
}

export default function AccountSessionsPage() {
  return (
    <Suspense
      fallback={<div className="h-96 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />}
    >
      <SessionsPageContent />
    </Suspense>
  )
}
