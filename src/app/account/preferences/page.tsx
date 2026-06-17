import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { getAccountHeader, getAccountPreferences } from '@/modules/account/services'
import { AccountShell } from '@/components/account/AccountShell'
import { PreferencesForm } from '@/components/account/PreferencesForm'

async function PreferencesPageContent() {
  const session = await getSession()
  if (!session) redirect('/login')

  const [header, preferences] = await Promise.all([
    getAccountHeader(session.user.id),
    getAccountPreferences(session.user.id),
  ])
  if (!header) redirect('/login')

  return (
    <AccountShell
      header={header}
      title="Preferences"
      description="Customize appearance, editor, dashboard, and content defaults."
    >
      <PreferencesForm preferences={preferences} />
    </AccountShell>
  )
}

export default function AccountPreferencesPage() {
  return (
    <Suspense
      fallback={<div className="h-96 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />}
    >
      <PreferencesPageContent />
    </Suspense>
  )
}
