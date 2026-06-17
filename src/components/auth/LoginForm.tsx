'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { loginSchema } from '@/modules/auth/validators/login'
import { loginAction } from '@/modules/auth/actions/login'
import { ensureCsrfTokenAction } from '@/modules/auth/actions/csrf'
import { formatAuthError } from '@/lib/auth/error-messages'
import { AuthAlert } from './AuthAlert'
import { AuthButton } from './AuthButton'
import { AuthFormSkeleton } from './AuthFormSkeleton'
import { AuthInput } from './AuthInput'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showSpinner, setShowSpinner] = useState(false)
  const [csrfToken, setCsrfToken] = useState<string | null>(null)
  const [capsLockOn, setCapsLockOn] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    ensureCsrfTokenAction()
      .then((token) => {
        setCsrfToken(token)
        setReady(true)
      })
      .catch(() => {
        setError(formatAuthError('Failed to initialize security token'))
        setReady(true)
      })
  }, [])

  useEffect(() => {
    const err = searchParams.get('error')
    if (err === 'forbidden') {
      setError(formatAuthError('You do not have permission to access that area.'))
    }
  }, [searchParams])

  useEffect(() => {
    if (!loading) {
      setShowSpinner(false)
      return
    }
    const timer = window.setTimeout(() => setShowSpinner(true), 200)
    return () => window.clearTimeout(timer)
  }, [loading])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false },
  })

  const onSubmit = async (data: { email: string; password: string; remember?: boolean }) => {
    if (!csrfToken) {
      setError(formatAuthError('Security token not ready'))
      return
    }

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.set('email', data.email)
    formData.set('password', data.password)
    if (data.remember) formData.set('remember', 'true')

    try {
      const result = await loginAction(formData, { csrfToken })

      if (!result.success) {
        setError(formatAuthError(result.error))
        setLoading(false)
        return
      }

      const redirect = result.data?.redirect ?? searchParams.get('callbackUrl') ?? '/admin'
      router.push(redirect)
      router.refresh()
    } catch {
      setError(formatAuthError('network error'))
      setLoading(false)
    }
  }

  if (!ready) {
    return <AuthFormSkeleton />
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {error && <AuthAlert message={error} />}

      <AuthInput
        label="Email"
        type="email"
        autoComplete="email"
        inputMode="email"
        placeholder="you@company.com"
        icon={<EnvelopeIcon className="h-5 w-5" aria-hidden />}
        error={errors.email?.message}
        disabled={loading}
        {...register('email')}
      />

      <AuthInput
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="Enter your password"
        icon={<LockClosedIcon className="h-5 w-5" aria-hidden />}
        showPasswordToggle
        onCapsLockChange={setCapsLockOn}
        hint={capsLockOn ? 'Caps Lock is on' : undefined}
        error={errors.password?.message}
        disabled={loading}
        {...register('password')}
      />

      <div className="flex items-center justify-between gap-4">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            className="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-950"
            disabled={loading}
            {...register('remember')}
          />
          Remember me
        </label>
        <Link
          href="/forgot-password"
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium underline-offset-4 transition-colors hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <AuthButton loading={showSpinner} loadingText="Signing in" disabled={!csrfToken || loading}>
        Sign In
      </AuthButton>
    </form>
  )
}
