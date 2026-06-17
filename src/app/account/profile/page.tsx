import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { getAccountHeader, getAccountProfile } from '@/modules/account/services'
import { AccountShell } from '@/components/account/AccountShell'
import { ProfileForm } from '@/components/account/ProfileForm'
import { DangerZone } from '@/components/account/DangerZone'

function ProfileSkeleton() {
  return <div className="h-96 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
}

async function ProfilePageContent() {
  const session = await getSession()
  if (!session) redirect('/login')

  const [header, profile] = await Promise.all([
    getAccountHeader(session.user.id),
    getAccountProfile(session.user.id),
  ])
  if (!header || !profile) redirect('/login')

  return (
    <AccountShell
      header={header}
      title="Profile"
      description="Manage your personal information and public author profile."
    >
      <ProfileForm profile={profile} />
      <DangerZone />
    </AccountShell>
  )
}

export default function AccountProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfilePageContent />
    </Suspense>
  )
}
