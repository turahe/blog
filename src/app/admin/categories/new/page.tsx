import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { CategoryCreateForm } from '@/modules/categories/components/CategoryCreateForm'

export const dynamic = 'force-dynamic'

export default function NewCategoryPage() {
  return (
    <div>
      <Breadcrumbs
        items={[{ label: 'Categories', href: '/admin/categories' }, { label: 'Create' }]}
      />
      <AdminPageHeader title="Create Category" />
      <CategoryCreateForm />
    </div>
  )
}
