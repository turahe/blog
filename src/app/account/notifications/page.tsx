import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { getAccountHeader, getAccountNotifications } from '@/modules/account/services'
import { AccountShell } from '@/components/account/AccountShell'
import { NotificationsForm } from '@/components/account/NotificationsForm'

async function NotificationsPageContent() {
  const session = await getSession()
  if (!session) redirect('/login')

  const [header, notifications] = await Promise.all([
    getAccountHeader(session.user.id),
    getAccountNotifications(session.user.id),
  ])
  if (!header) redirect('/login')

  return (
    <AccountShell
      header={header}
      title="Notifications"
      description="Choose how you receive email and in-app notifications."
    >
      <NotificationsForm email={notifications.email} inApp={notifications.inApp} />
    </AccountShell>
  )
}

export default function AccountNotificationsPage() {
  return (
    <Suspense
      fallback={<div className="h-96 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />}
    >
      <NotificationsPageContent />
    </Suspense>
  )
}
