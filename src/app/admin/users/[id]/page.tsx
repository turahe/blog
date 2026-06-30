import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { getUserById } from '@/modules/users/services'
import { getAllRoles } from '@/modules/roles/services'
import { UserEditForm } from '@/modules/users/components/UserEditForm'
import { can } from '@/lib/rbac'
import { getSession } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditUserPage({ params }: PageProps) {
  const { id } = await params
  const [user, roles, session] = await Promise.all([getUserById(id), getAllRoles(), getSession()])

  if (!user) notFound()

  const canDelete = session ? await can('users.delete', session.user.id) : false

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Users', href: '/admin/users' }, { label: user.fullName }]} />
      <AdminPageHeader title="Edit User" />
      <UserEditForm
        user={{
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          status: user.status,
          roleIds: user.userRoles.map((ur) => ur.role.id),
        }}
        roles={roles.map((r) => ({ id: r.id, name: r.name, slug: r.slug }))}
        canDelete={canDelete}
      />
    </div>
  )
}
