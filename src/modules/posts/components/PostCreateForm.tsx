'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createPostSchema } from '@/modules/posts/validators'
import { createPostAction } from '@/modules/posts/actions'
import { PostEditorShell } from '@/components/admin/editor/PostEditorShell'
import { PostSettingsPanel } from '@/components/admin/editor/PostSettingsPanel'
import { EditorToolbar } from '@/components/admin/editor/EditorToolbar'

interface PostFormProps {
  authors: { id: string; fullName: string; slug: string | null }[]
  tags: { id: string; name: string; slug: string }[]
  categories: { id: string; name: string; slug: string }[]
}

export function PostCreateForm({ authors, tags, categories }: PostFormProps) {
  const router = useRouter()
  const bodyRef = useRef<HTMLTextAreaElement>(null)

  const form = useForm({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      slug: '',
      title: '',
      date: new Date().toISOString().slice(0, 10),
      lastmod: '',
      draft: true,
      summary: '',
      body: '',
      layout: 'PostLayout',
      featuredImage: '',
      canonicalUrl: '',
      tagIds: [] as string[],
      authorIds: [] as string[],
      categoryId: '',
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
      const result = await createPostAction({ ...data, draft })
      if (!result.success) {
        setError('root', { message: result.error })
        return
      }
      router.push('/admin/posts')
      router.refresh()
    })

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
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">New post</p>
              {errors.root && <p className="admin-error">{errors.root.message}</p>}
            </div>
            <div className="flex gap-2">
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
                {isSubmitting ? 'Publishing…' : 'Publish'}
              </button>
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
            {errors.title && <p className="admin-error">{errors.title.message}</p>}

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
              {errors.body && <p className="admin-error">{errors.body.message}</p>}
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
            featuredImage={watch('featuredImage') ?? ''}
            onFeaturedImageChange={(url) => setValue('featuredImage', url, { shouldDirty: true })}
          />
        }
      />
    </form>
  )
}
