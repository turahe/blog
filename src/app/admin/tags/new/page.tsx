import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { TagCreateForm } from '@/modules/tags/components/TagCreateForm'

export const dynamic = 'force-dynamic'

export default function NewTagPage() {
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Tags', href: '/admin/tags' }, { label: 'Create' }]} />
      <AdminPageHeader title="Create Tag" />
      <TagCreateForm />
    </div>
  )
}
