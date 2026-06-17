import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import { PostEditForm } from '@/modules/posts/components/PostEditForm'
import {
  getPostById,
  getAuthorOptions,
  getCategoryOptions,
  getTagOptions,
} from '@/modules/posts/services'
import { can } from '@/lib/rbac'
import { getSession } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params

  if (id === 'new') {
    const { default: NewPostPage } = await import('../new/page')
    return NewPostPage()
  }

  const [post, authors, tags, categories, session] = await Promise.all([
    getPostById(id),
    getAuthorOptions(),
    getTagOptions(),
    getCategoryOptions(),
    getSession(),
  ])

  if (!post) notFound()

  const canDelete = session ? await can('posts.delete', session.user.id) : false

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Posts', href: '/admin/posts' }, { label: post.title }]} />
      <PostEditForm
        post={{
          id: post.id,
          slug: post.slug,
          title: post.title,
          date: post.date,
          lastmod: post.lastmod,
          draft: post.draft,
          summary: post.summary,
          body: post.body,
          layout: post.layout,
          categoryId: post.categoryId ?? post.category?.id ?? null,
          tagIds: post.tags.map((t) => t.tagId),
          authorIds: post.authors.map((a) => a.userId),
          canonicalUrl: post.canonicalUrl,
          images: post.images,
        }}
        authors={authors}
        tags={tags}
        categories={categories}
        canDelete={canDelete}
      />
    </div>
  )
}
