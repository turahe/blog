'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  loadingText?: string
  children: ReactNode
}

export function AuthButton({
  loading = false,
  loadingText = 'Please wait',
  children,
  disabled,
  className = '',
  type = 'submit',
  ...props
}: AuthButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`bg-primary-600 hover:bg-primary-700 focus-visible:ring-primary-500 relative inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-gray-950 ${className}`}
      {...props}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
          aria-hidden
        />
      )}
      <span>{loading ? loadingText : children}</span>
    </button>
  )
}
