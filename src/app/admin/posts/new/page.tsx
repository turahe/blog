import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import { PostCreateForm } from '@/modules/posts/components/PostCreateForm'
import { getAuthorOptions, getCategoryOptions, getTagOptions } from '@/modules/posts/services'

export const dynamic = 'force-dynamic'

export default async function NewPostPage() {
  const [authors, tags, categories] = await Promise.all([
    getAuthorOptions(),
    getTagOptions(),
    getCategoryOptions(),
  ])

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Posts', href: '/admin/posts' }, { label: 'Create' }]} />
      <PostCreateForm authors={authors} tags={tags} categories={categories} />
    </div>
  )
}
