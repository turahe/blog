import type { ReactNode } from 'react'
import { AuthCard } from './AuthCard'
import { AuthFooter } from './AuthFooter'
import { AuthHeader } from './AuthHeader'

interface LoginCardProps {
  title: string
  description?: string
  children: ReactNode
  footerHelpLabel?: string
  footerHelpHref?: string
}

export function LoginCard({
  title,
  description,
  children,
  footerHelpLabel,
  footerHelpHref,
}: LoginCardProps) {
  return (
    <AuthCard>
      <AuthHeader title={title} description={description} />
      {children}
      <AuthFooter helpLabel={footerHelpLabel} helpHref={footerHelpHref} />
    </AuthCard>
  )
}
