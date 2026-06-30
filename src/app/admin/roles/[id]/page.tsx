import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { RoleEditor } from '@/modules/roles/components/RoleEditor'
import {
  getAllPermissionsCatalog,
  getRoleAuditTimeline,
  getRoleDetail,
} from '@/modules/roles/services'
import { can } from '@/lib/rbac'
import { getSession } from '@/lib/auth/session'
import { formatDate } from '@/lib/formatDate'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function RoleDetailPage({ params }: PageProps) {
  const { id } = await params
  const [role, catalog, session] = await Promise.all([
    getRoleDetail(id),
    getAllPermissionsCatalog(),
    getSession(),
  ])

  if (!role) notFound()

  const auditEntries = await getRoleAuditTimeline(id)
  const canDelete = session ? await can('roles.delete', session.user.id) : false

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Roles', href: '/admin/roles' }, { label: role.name }]} />
      <AdminPageHeader
        title={role.name}
        description={`Last updated ${formatDate(role.updatedAt)}`}
        actions={
          <Link href="/admin/roles" className="admin-btn-secondary">
            Back to roles
          </Link>
        }
      />
      <RoleEditor role={role} catalog={catalog} auditEntries={auditEntries} canDelete={canDelete} />
    </div>
  )
}
