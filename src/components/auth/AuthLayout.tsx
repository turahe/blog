import type { ReactNode } from 'react'
import { AuthBrandPanel } from './AuthBrandPanel'

interface AuthLayoutProps {
  children: ReactNode
  brandTitle?: string
  brandDescription?: string
}

export function AuthLayout({ children, brandTitle, brandDescription }: AuthLayoutProps) {
  return (
    <div className="fixed inset-0 z-[100] flex min-h-[100dvh] overflow-y-auto bg-gray-50 dark:bg-gray-950">
      <AuthBrandPanel title={brandTitle} description={brandDescription} />
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-[28rem]">{children}</div>
      </div>
    </div>
  )
}
