import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { ProjectCreateForm } from '@/modules/projects/components/ProjectCreateForm'

export const dynamic = 'force-dynamic'

export default function NewProjectPage() {
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Projects', href: '/admin/projects' }, { label: 'Create' }]} />
      <AdminPageHeader title="Create Project" />
      <ProjectCreateForm />
    </div>
  )
}
