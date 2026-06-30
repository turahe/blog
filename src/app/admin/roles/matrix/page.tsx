import Link from 'next/link'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { PermissionMatrix } from '@/modules/roles/components/PermissionMatrix'
import { getPermissionMatrixData } from '@/modules/roles/services'

export const dynamic = 'force-dynamic'

export default async function RoleMatrixPage() {
  const { roles, rows } = await getPermissionMatrixData()

  return (
    <div>
      <Breadcrumbs
        items={[{ label: 'Roles', href: '/admin/roles' }, { label: 'Permission matrix' }]}
      />
      <AdminPageHeader
        title="Permission matrix"
        description="Compare and edit role permissions across your organization."
        actions={
          <Link href="/admin/roles" className="admin-btn-secondary">
            Back to roles
          </Link>
        }
      />
      <PermissionMatrix roles={roles} rows={rows} />
    </div>
  )
}
