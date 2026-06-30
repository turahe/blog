import Link from 'next/link'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { RoleCreateForm } from '@/modules/roles/components/RoleCreateForm'
import { getAllPermissionsCatalog } from '@/modules/roles/services'

export const dynamic = 'force-dynamic'

export default async function NewRolePage() {
  const catalog = await getAllPermissionsCatalog()

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Roles', href: '/admin/roles' }, { label: 'Create role' }]} />
      <AdminPageHeader
        title="Create role"
        description="Define a new custom role and assign permissions."
        actions={
          <Link href="/admin/roles" className="admin-btn-secondary">
            Back to roles
          </Link>
        }
      />
      <RoleCreateForm catalog={catalog} />
    </div>
  )
}
