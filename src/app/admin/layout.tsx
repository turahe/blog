import { Outfit } from 'next/font/google'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { can } from '@/lib/rbac'
import { getAdminHeaderUser } from '@/lib/admin/get-header-user'
import { AdminShell } from '@/components/admin/AdminShell'

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
})

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const allowed = await can('dashboard.view', session.user.id)
  if (!allowed) {
    redirect('/login?error=forbidden')
  }

  const headerUser = await getAdminHeaderUser(session.user.id)

  if (!headerUser) {
    redirect('/login')
  }

  return (
    <div className={outfit.className}>
      <AdminShell user={headerUser}>{children}</AdminShell>
    </div>
  )
}
