import { Outfit } from 'next/font/google'
import { redirect } from 'next/navigation'
import { getAuthenticatedShellContext } from '@/lib/admin/get-admin-shell-context'
import { AdminShell } from '@/components/admin/AdminShell'
import { getAccountHeader } from '@/modules/account/services'

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
})

export const dynamic = 'force-dynamic'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const shell = await getAuthenticatedShellContext()
  if (!shell) {
    redirect('/login')
  }

  const accountHeader = await getAccountHeader(shell.session.user.id)
  if (!accountHeader) {
    redirect('/login')
  }

  return (
    <div className={outfit.className}>
      <AdminShell user={shell.headerUser}>
        <div data-account-layout>{children}</div>
      </AdminShell>
    </div>
  )
}
