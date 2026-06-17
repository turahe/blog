import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { TagEditForm } from '@/modules/tags/components/TagEditForm'
import { getTagById } from '@/modules/tags/services'
import { can } from '@/lib/rbac'
import { getSession } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditTagPage({ params }: PageProps) {
  const { id } = await params
  const [tag, session] = await Promise.all([getTagById(id), getSession()])
  if (!tag) notFound()

  const canDelete = session ? await can('tags.delete', session.user.id) : false

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Tags', href: '/admin/tags' }, { label: tag.name }]} />
      <AdminPageHeader title="Edit Tag" />
      <TagEditForm tag={tag} canDelete={canDelete} />
    </div>
  )
}
