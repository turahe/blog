'use client'

import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

export interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  icon?: ReactNode
  showPasswordToggle?: boolean
  onCapsLockChange?: (active: boolean) => void
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(function AuthInput(
  {
    label,
    error,
    hint,
    icon,
    showPasswordToggle = false,
    onCapsLockChange,
    type = 'text',
    className = '',
    id: idProp,
    disabled,
    ...props
  },
  ref
) {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const [visible, setVisible] = useState(false)
  const isPassword = showPasswordToggle || type === 'password'
  const inputType = isPassword && visible ? 'text' : type

  const baseInputClass =
    'block w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition-[border-color,box-shadow] duration-150 placeholder:text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500'

  const stateClass = error
    ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-red-500/60'
    : 'border-gray-300 hover:border-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:hover:border-gray-600'

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 dark:text-gray-500">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          id={id}
          type={inputType}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined
          }
          className={`${baseInputClass} ${stateClass} ${icon ? 'pl-10' : ''} ${isPassword ? 'pr-11' : ''} ${className}`}
          onKeyUp={(e) => {
            props.onKeyUp?.(e)
            if (isPassword && onCapsLockChange) {
              onCapsLockChange(e.getModifierState('CapsLock'))
            }
          }}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setVisible((v) => !v)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        )}
      </div>
      <div className="min-h-[1.25rem]">
        {error ? (
          <p id={errorId} role="alert" className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="text-xs text-gray-500 dark:text-gray-400">
            {hint}
          </p>
        ) : null}
      </div>
    </div>
  )
})
