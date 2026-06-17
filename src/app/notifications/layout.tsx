import { Outfit } from 'next/font/google'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { getAdminHeaderUser } from '@/lib/admin/get-header-user'
import { AdminShell } from '@/components/admin/AdminShell'

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
})

export const dynamic = 'force-dynamic'

export default async function NotificationsLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const headerUser = await getAdminHeaderUser(session.user.id)
  if (!headerUser) redirect('/login')

  return (
    <div className={outfit.className}>
      <AdminShell user={headerUser}>{children}</AdminShell>
    </div>
  )
}
