'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updatePostSchema } from '@/modules/posts/validators'
import { updatePostAction, deletePostAction } from '@/modules/posts/actions'
import { PostEditorShell } from '@/components/admin/editor/PostEditorShell'
import { PostSettingsPanel } from '@/components/admin/editor/PostSettingsPanel'
import { EditorToolbar } from '@/components/admin/editor/EditorToolbar'
import { getPostFeaturedImage } from '@/lib/blog/post-images'

interface PostEditFormProps {
  post: {
    id: string
    slug: string
    title: string
    date: Date
    lastmod: Date | null
    draft: boolean
    summary: string | null
    body: string
    layout: string | null
    categoryId: string | null
    tagIds: string[]
    authorIds: string[]
    canonicalUrl?: string | null
    images?: unknown
  }
  authors: { id: string; fullName: string; slug: string | null }[]
  tags: { id: string; name: string; slug: string }[]
  categories: { id: string; name: string; slug: string }[]
  canDelete: boolean
}

export function PostEditForm({ post, authors, tags, categories, canDelete }: PostEditFormProps) {
  const router = useRouter()
  const bodyRef = useRef<HTMLTextAreaElement>(null)

  const form = useForm({
    resolver: zodResolver(updatePostSchema),
    defaultValues: {
      slug: post.slug,
      title: post.title,
      date: post.date.toISOString().slice(0, 10),
      lastmod: post.lastmod?.toISOString().slice(0, 10) ?? '',
      draft: post.draft,
      summary: post.summary ?? '',
      body: post.body,
      layout: post.layout ?? 'PostLayout',
      featuredImage: getPostFeaturedImage(post.images as string | string[] | undefined) ?? '',
      canonicalUrl: post.canonicalUrl ?? '',
      categoryId: post.categoryId ?? '',
      tagIds: post.tagIds,
      authorIds: post.authorIds,
    },
  })

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = form

  const submit = (draft: boolean) =>
    handleSubmit(async (data) => {
      const result = await updatePostAction(post.id, { ...data, draft })
      if (!result.success) {
        setError('root', { message: result.error })
        return
      }
      router.push('/admin/posts')
      router.refresh()
    })

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return
    const result = await deletePostAction(post.id)
    if (!result.success) {
      setError('root', { message: result.error })
      return
    }
    router.push('/admin/posts')
    router.refresh()
  }

  const insertSnippet = (snippet: string) => {
    const el = bodyRef.current
    const current = getValues('body') ?? ''
    if (!el) {
      setValue('body', current + snippet)
      return
    }
    const start = el.selectionStart ?? current.length
    const next = current.slice(0, start) + snippet + current.slice(el.selectionEnd ?? start)
    setValue('body', next)
  }

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <PostEditorShell
        header={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {post.draft ? 'Draft' : 'Published'}
              </p>
              {errors.root && <p className="admin-error">{errors.root.message}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href={`/blog/${post.slug}`} target="_blank" className="admin-btn-secondary">
                Preview
              </Link>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={submit(true)}
                className="admin-btn-secondary"
              >
                Save draft
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={submit(false)}
                className="admin-btn-primary"
              >
                {isSubmitting ? 'Saving…' : 'Publish'}
              </button>
              {canDelete && (
                <button type="button" onClick={handleDelete} className="admin-btn-danger">
                  Delete
                </button>
              )}
            </div>
          </div>
        }
        main={
          <div className="space-y-5">
            <input
              {...register('title')}
              placeholder="Post title"
              className="w-full border-0 bg-transparent text-2xl font-bold text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none dark:text-gray-100"
            />

            <div className="admin-field">
              <label htmlFor="post-excerpt" className="admin-label">
                Excerpt
              </label>
              <textarea
                id="post-excerpt"
                {...register('summary')}
                rows={2}
                className="admin-textarea"
              />
            </div>

            <div className="admin-field">
              <label htmlFor="post-content" className="admin-label">
                Content (Markdown)
              </label>
              <EditorToolbar onInsert={insertSnippet} />
              <textarea
                id="post-content"
                {...register('body')}
                ref={(el) => {
                  register('body').ref(el)
                  bodyRef.current = el
                }}
                rows={18}
                className="admin-textarea mt-2 min-h-[20rem] font-mono"
              />
            </div>
          </div>
        }
        sidebar={
          <PostSettingsPanel
            register={register}
            errors={errors}
            authors={authors}
            tags={tags}
            categories={categories}
            tagIds={watch('tagIds') ?? []}
            onTagIdsChange={(ids) => setValue('tagIds', ids, { shouldDirty: true })}
            defaultAuthorIds={post.authorIds}
            featuredImage={watch('featuredImage') ?? ''}
            onFeaturedImageChange={(url) => setValue('featuredImage', url, { shouldDirty: true })}
          />
        }
      />
    </form>
  )
}
