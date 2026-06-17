'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateTagSchema } from '@/modules/tags/validators'
import { updateTagAction, deleteTagAction } from '@/modules/tags/actions'

interface TagEditFormProps {
  tag: { id: string; slug: string; name: string; description: string | null }
  canDelete: boolean
}

export function TagEditForm({ tag, canDelete }: TagEditFormProps) {
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(updateTagSchema),
    defaultValues: {
      slug: tag.slug,
      name: tag.name,
      description: tag.description ?? '',
    },
  })
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = form

  const onSubmit = async (data: Record<string, unknown>) => {
    const result = await updateTagAction(tag.id, data)
    if (!result.success) {
      setError('root', { message: result.error })
      return
    }
    router.push('/admin/tags')
    router.refresh()
  }

  const handleDelete = async () => {
    if (!confirm('Delete this tag?')) return
    const result = await deleteTagAction(tag.id)
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
          Save Changes
        </button>
        {canDelete && (
          <button type="button" onClick={handleDelete} className="admin-btn-danger">
            Delete
          </button>
        )}
      </div>
    </form>
  )
}
