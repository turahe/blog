import Link from 'next/link'
import { LoginCard } from '@/components/auth/LoginCard'
import { AuthAlert } from '@/components/auth/AuthAlert'

export const metadata = {
  title: 'Verify email',
}

export default function VerifyEmailPage() {
  return (
    <LoginCard
      title="Check your inbox"
      description="We sent a verification link to confirm your email address."
      footerHelpLabel="Back to sign in"
      footerHelpHref="/login"
    >
      <div className="space-y-5">
        <AuthAlert
          variant="info"
          message="Email verification is not required for admin accounts in this environment. You can continue to the dashboard after signing in."
        />
        <Link
          href="/login"
          className="bg-primary-600 hover:bg-primary-700 focus-visible:ring-primary-500 inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
        >
          Go to sign in
        </Link>
      </div>
    </LoginCard>
  )
}
