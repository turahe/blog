import Link from 'next/link'
import { LoginCard } from '@/components/auth/LoginCard'

export const metadata = {
  title: 'Forgot password',
}

export default function ForgotPasswordPage() {
  return (
    <LoginCard
      title="Reset your password"
      description="Password recovery is managed by your administrator. Contact them to reset your account."
      footerHelpLabel="Back to sign in"
      footerHelpHref="/login"
    >
      <div className="space-y-5">
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          For security, we do not send password reset links from this screen yet. If you are locked
          out, reach out to your site administrator with the email address on your account.
        </p>
        <Link
          href="/login"
          className="focus-visible:ring-primary-500 inline-flex w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-950"
        >
          Return to sign in
        </Link>
      </div>
    </LoginCard>
  )
}
