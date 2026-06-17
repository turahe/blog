'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateUserSchema, type UpdateUserInput } from '@/modules/users/validators'
import { updateUserAction, deleteUserAction } from '@/modules/users/actions'

interface UserEditFormProps {
  user: {
    id: string
    email: string
    fullName: string
    status: string
    roleIds: string[]
  }
  roles: { id: string; name: string }[]
  canDelete: boolean
}

export function UserEditForm({ user, roles, canDelete }: UserEditFormProps) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      email: user.email,
      fullName: user.fullName,
      status: user.status as UpdateUserInput['status'],
      roleIds: user.roleIds,
    },
  })

  const onSubmit = async (data: UpdateUserInput) => {
    const result = await updateUserAction(user.id, data)
    if (!result.success) {
      setError('root', { message: result.error })
      return
    }
    router.refresh()
  }

  const handleDelete = async () => {
    if (!confirm('Delete this user?')) return
    const result = await deleteUserAction(user.id)
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
        <label htmlFor="user-edit-email" className="admin-label">
          Email
        </label>
        <input id="user-edit-email" {...register('email')} className="admin-input" />
      </div>

      <div className="admin-field">
        <label htmlFor="user-edit-password" className="admin-label">
          New Password (leave blank to keep)
        </label>
        <input
          id="user-edit-password"
          type="password"
          {...register('password')}
          className="admin-input"
        />
      </div>

      <div className="admin-field">
        <label htmlFor="user-edit-full-name" className="admin-label">
          Full Name
        </label>
        <input id="user-edit-full-name" {...register('fullName')} className="admin-input" />
      </div>

      <div className="admin-field">
        <label htmlFor="user-edit-status" className="admin-label">
          Status
        </label>
        <select id="user-edit-status" {...register('status')} className="admin-select">
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
                defaultChecked={user.roleIds.includes(role.id)}
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
