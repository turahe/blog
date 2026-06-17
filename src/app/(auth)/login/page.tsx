import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { LoginCard } from '@/components/auth/LoginCard'
import { LoginForm } from '@/components/auth/LoginForm'
import { AuthFormSkeleton } from '@/components/auth/AuthFormSkeleton'

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  const session = await getSession()
  if (session) {
    redirect('/admin')
  }

  return (
    <LoginCard
      title="Welcome back"
      description="Sign in to your admin dashboard to manage content and settings."
    >
      <Suspense fallback={<AuthFormSkeleton />}>
        <LoginForm />
      </Suspense>
    </LoginCard>
  )
}
