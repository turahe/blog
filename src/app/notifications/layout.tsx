import { Outfit } from 'next/font/google'
import { redirect } from 'next/navigation'
import { AdminShell } from '@/components/admin/AdminShell'
import { getAuthenticatedShellContext } from '@/lib/admin/get-admin-shell-context'

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
})

export const dynamic = 'force-dynamic'

export default async function NotificationsLayout({ children }: { children: React.ReactNode }) {
  const shell = await getAuthenticatedShellContext()
  if (!shell) {
    redirect('/login')
  }

  return (
    <div className={outfit.className}>
      <AdminShell user={shell.headerUser}>{children}</AdminShell>
    </div>
  )
}
