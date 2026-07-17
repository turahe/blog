import { notFound } from 'next/navigation'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import { getSession } from '@/lib/auth/session'
import { can } from '@/lib/rbac'
import { CategoryEditForm } from '@/modules/categories/components/CategoryEditForm'
import { getCategoryById } from '@/modules/categories/services'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params
  const [category, session] = await Promise.all([getCategoryById(id), getSession()])
  if (!category) notFound()

  const canDelete = session ? await can('categories.delete', session.user.id) : false

  return (
    <div>
      <Breadcrumbs
        items={[{ label: 'Categories', href: '/admin/categories' }, { label: category.name }]}
      />
      <AdminPageHeader title="Edit Category" />
      <CategoryEditForm category={category} canDelete={canDelete} />
    </div>
  )
}
