'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createProjectSchema } from '@/modules/projects/validators'
import { createProjectAction } from '@/modules/projects/actions'
import { MediaImageField } from '@/components/admin/media/MediaImageField'

export function ProjectCreateForm() {
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { title: '', description: '', imgSrc: '', href: '', sortOrder: 0 },
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
    const result = await createProjectAction(data)
    if (!result.success) {
      setError('root', { message: result.error })
      return
    }
    router.push('/admin/projects')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="admin-form max-w-lg">
      {errors.root && <p className="admin-error">{errors.root.message}</p>}
      <div className="admin-field">
        <label htmlFor="project-title" className="admin-label">
          Title
        </label>
        <input id="project-title" {...register('title')} className="admin-input" />
      </div>
      <div className="admin-field">
        <label htmlFor="project-description" className="admin-label">
          Description
        </label>
        <textarea
          id="project-description"
          {...register('description')}
          rows={4}
          className="admin-textarea"
        />
      </div>
      <MediaImageField
        label="Image"
        value={watch('imgSrc') ?? ''}
        onChange={(url) => setValue('imgSrc', url, { shouldDirty: true })}
        folder="projects"
      />
      <div className="admin-field">
        <label htmlFor="project-href" className="admin-label">
          Link URL
        </label>
        <input id="project-href" {...register('href')} className="admin-input" />
      </div>
      <div className="admin-field">
        <label htmlFor="project-sort-order" className="admin-label">
          Sort Order
        </label>
        <input
          id="project-sort-order"
          type="number"
          {...register('sortOrder')}
          className="admin-input"
        />
      </div>
      <div className="admin-form-actions">
        <button type="submit" disabled={isSubmitting} className="admin-btn-primary">
          Create Project
        </button>
      </div>
    </form>
  )
}
