import Link from 'next/link'
import { LoginCard } from '@/components/auth/LoginCard'
import { AuthAlert } from '@/components/auth/AuthAlert'

export const metadata = {
  title: 'Reset password',
}

export default function ResetPasswordPage() {
  return (
    <LoginCard
      title="Choose a new password"
      description="This flow will be available when self-service password reset is enabled."
      footerHelpLabel="Back to sign in"
      footerHelpHref="/login"
    >
      <div className="space-y-5">
        <AuthAlert
          variant="info"
          message="Password reset via email is not configured yet. Please contact your administrator."
        />
        <Link
          href="/login"
          className="bg-primary-600 hover:bg-primary-700 focus-visible:ring-primary-500 inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
        >
          Sign in instead
        </Link>
      </div>
    </LoginCard>
  )
}
