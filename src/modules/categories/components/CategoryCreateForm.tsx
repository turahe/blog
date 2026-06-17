'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createCategorySchema } from '@/modules/categories/validators'
import { createCategoryAction } from '@/modules/categories/actions'
import { MediaImageField } from '@/components/admin/media/MediaImageField'

export function CategoryCreateForm() {
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(createCategorySchema),
    defaultValues: { slug: '', name: '', description: '', imageUrl: '' },
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
    const result = await createCategoryAction(data)
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
        {errors.slug && <p className="admin-error">{errors.slug.message}</p>}
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
          Create Category
        </button>
      </div>
    </form>
  )
}
