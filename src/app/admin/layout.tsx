import { Outfit } from 'next/font/google'
import { redirect } from 'next/navigation'
import { getAdminLayoutContext } from '@/lib/admin/get-admin-shell-context'
import { AdminShell } from '@/components/admin/AdminShell'

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
})

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const context = await getAdminLayoutContext()

  if (context.status === 'unauthenticated') {
    redirect('/login')
  }

  if (context.status === 'forbidden') {
    redirect('/login?error=forbidden')
  }

  return (
    <div className={outfit.className}>
      <AdminShell user={context.headerUser}>{children}</AdminShell>
    </div>
  )
}
