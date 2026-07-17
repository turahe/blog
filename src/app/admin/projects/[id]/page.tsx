import { notFound } from 'next/navigation'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import { getSession } from '@/lib/auth/session'
import { can } from '@/lib/rbac'
import { ProjectEditForm } from '@/modules/projects/components/ProjectEditForm'
import { getProjectById } from '@/modules/projects/services'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params
  const [project, session] = await Promise.all([getProjectById(id), getSession()])
  if (!project) notFound()

  const canDelete = session ? await can('projects.delete', session.user.id) : false

  return (
    <div>
      <Breadcrumbs
        items={[{ label: 'Projects', href: '/admin/projects' }, { label: project.title }]}
      />
      <AdminPageHeader title="Edit Project" />
      <ProjectEditForm project={project} canDelete={canDelete} />
    </div>
  )
}
