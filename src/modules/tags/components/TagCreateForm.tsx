'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createTagSchema } from '@/modules/tags/validators'
import { createTagAction } from '@/modules/tags/actions'

export function TagCreateForm() {
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(createTagSchema),
    defaultValues: { slug: '', name: '', description: '' },
  })
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = form

  const onSubmit = async (data: Record<string, unknown>) => {
    const result = await createTagAction(data)
    if (!result.success) {
      setError('root', { message: result.error })
      return
    }
    router.push('/admin/tags')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="admin-form max-w-lg">
      {errors.root && <p className="admin-error">{errors.root.message}</p>}
      <div className="admin-field">
        <label htmlFor="tag-slug" className="admin-label">
          Slug
        </label>
        <input id="tag-slug" {...register('slug')} className="admin-input" />
        {errors.slug && <p className="admin-error">{errors.slug.message}</p>}
      </div>
      <div className="admin-field">
        <label htmlFor="tag-name" className="admin-label">
          Name
        </label>
        <input id="tag-name" {...register('name')} className="admin-input" />
      </div>
      <div className="admin-field">
        <label htmlFor="tag-description" className="admin-label">
          Description
        </label>
        <textarea
          id="tag-description"
          {...register('description')}
          rows={3}
          className="admin-textarea"
        />
      </div>
      <div className="admin-form-actions">
        <button type="submit" disabled={isSubmitting} className="admin-btn-primary">
          Create Tag
        </button>
      </div>
    </form>
  )
}
