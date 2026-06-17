import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { getAllRoles } from '@/modules/roles/services'
import { UserCreateForm } from '@/modules/users/components/UserCreateForm'

export const dynamic = 'force-dynamic'

export default async function NewUserPage() {
  const roles = await getAllRoles()

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Users', href: '/admin/users' }, { label: 'Create' }]} />
      <AdminPageHeader title="Create User" />
      <UserCreateForm roles={roles} />
    </div>
  )
}
