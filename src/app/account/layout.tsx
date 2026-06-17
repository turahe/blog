import { Outfit } from 'next/font/google'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { getAdminHeaderUser } from '@/lib/admin/get-header-user'
import { AdminShell } from '@/components/admin/AdminShell'
import { getAccountHeader } from '@/modules/account/services'

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
})

export const dynamic = 'force-dynamic'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const [headerUser, accountHeader] = await Promise.all([
    getAdminHeaderUser(session.user.id),
    getAccountHeader(session.user.id),
  ])

  if (!headerUser || !accountHeader) {
    redirect('/login')
  }

  return (
    <div className={outfit.className}>
      <AdminShell user={headerUser}>
        <div data-account-layout>{children}</div>
      </AdminShell>
    </div>
  )
}
