'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserSchema } from '@/modules/users/validators'
import { createUserAction } from '@/modules/users/actions'

interface UserFormProps {
  roles: { id: string; name: string; slug: string }[]
}

export function UserCreateForm({ roles }: UserFormProps) {
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      status: 'ACTIVE' as const,
      roleIds: [] as string[],
    },
  })
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = form

  const onSubmit = async (data: {
    email: string
    password: string
    fullName: string
    status?: string
    roleIds?: string[]
    avatar?: string
  }) => {
    const result = await createUserAction(data)
    if (!result.success) {
      setError('root', { message: result.error })
      return
    }
    router.push('/admin/users')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="admin-form max-w-lg">
      {errors.root && <p className="admin-error">{errors.root.message}</p>}

      <div className="admin-field">
        <label htmlFor="user-email" className="admin-label">
          Email
        </label>
        <input id="user-email" {...register('email')} className="admin-input" />
        {errors.email && <p className="admin-error">{errors.email.message}</p>}
      </div>

      <div className="admin-field">
        <label htmlFor="user-password" className="admin-label">
          Password
        </label>
        <input
          id="user-password"
          type="password"
          {...register('password')}
          className="admin-input"
        />
        {errors.password && <p className="admin-error">{errors.password.message}</p>}
      </div>

      <div className="admin-field">
        <label htmlFor="user-full-name" className="admin-label">
          Full Name
        </label>
        <input id="user-full-name" {...register('fullName')} className="admin-input" />
        {errors.fullName && <p className="admin-error">{errors.fullName.message}</p>}
      </div>

      <div className="admin-field">
        <label htmlFor="user-status" className="admin-label">
          Status
        </label>
        <select id="user-status" {...register('status')} className="admin-select">
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="PENDING">Pending</option>
        </select>
      </div>

      <fieldset className="admin-field">
        <legend className="admin-label">Roles</legend>
        <div className="space-y-2">
          {roles.map((role) => (
            <label key={role.id} className="admin-checkbox-label">
              <input
                type="checkbox"
                value={role.id}
                {...register('roleIds')}
                className="admin-checkbox"
              />
              {role.name}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="admin-form-actions">
        <button type="submit" disabled={isSubmitting} className="admin-btn-primary">
          {isSubmitting ? 'Creating...' : 'Create User'}
        </button>
      </div>
    </form>
  )
}
