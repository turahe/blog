'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateCategorySchema } from '@/modules/categories/validators'
import { updateCategoryAction, deleteCategoryAction } from '@/modules/categories/actions'
import { MediaImageField } from '@/components/admin/media/MediaImageField'

interface CategoryEditFormProps {
  category: {
    id: string
    slug: string
    name: string
    description: string | null
    imageUrl: string | null
  }
  canDelete: boolean
}

export function CategoryEditForm({ category, canDelete }: CategoryEditFormProps) {
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      slug: category.slug,
      name: category.name,
      description: category.description ?? '',
      imageUrl: category.imageUrl ?? '',
    },
  })
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    setError,
  } = form

  const onSubmit = async (data: Record<string, unknown>) => {
    const result = await updateCategoryAction(category.id, data)
    if (!result.success) {
      setError('root', { message: result.error })
      return
    }
    router.push('/admin/categories')
    router.refresh()
  }

  const handleDelete = async () => {
    if (!confirm('Delete this category?')) return
    const result = await deleteCategoryAction(category.id)
    if (!result.success) {
      setError('root', { message: result.error })
      return
    }
    router.push('/admin/categories')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="admin-form max-w-lg">
      {errors.root && <p className="admin-error">{errors.root.message}</p>}
      <div className="admin-field">
        <label htmlFor="category-slug" className="admin-label">
          Slug
        </label>
        <input id="category-slug" {...register('slug')} className="admin-input" />
      </div>
      <div className="admin-field">
        <label htmlFor="category-name" className="admin-label">
          Name
        </label>
        <input id="category-name" {...register('name')} className="admin-input" />
      </div>
      <div className="admin-field">
        <label htmlFor="category-description" className="admin-label">
          Description
        </label>
        <textarea
          id="category-description"
          {...register('description')}
          rows={3}
          className="admin-textarea"
        />
      </div>
      <MediaImageField
        label="Image"
        value={watch('imageUrl') ?? ''}
        onChange={(url) => setValue('imageUrl', url, { shouldDirty: true })}
        folder="categories"
      />
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
