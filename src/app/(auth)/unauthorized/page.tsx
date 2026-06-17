import Link from 'next/link'
import { LoginCard } from '@/components/auth/LoginCard'
import { AuthAlert } from '@/components/auth/AuthAlert'
import { AUTH_PAGE_ERRORS } from '@/lib/auth/error-messages'

export const metadata = {
  title: 'Unauthorized',
}

export default function UnauthorizedPage() {
  return (
    <LoginCard
      title="Access denied"
      description="You do not have permission to view this page."
      footerHelpLabel="Contact support"
      footerHelpHref="/about"
    >
      <div className="space-y-5">
        <AuthAlert variant="warning" message={AUTH_PAGE_ERRORS.forbidden} />
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="bg-primary-600 hover:bg-primary-700 focus-visible:ring-primary-500 inline-flex flex-1 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
          >
            Sign in
          </Link>
          <Link
            href="/"
            className="focus-visible:ring-primary-500 inline-flex flex-1 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-950"
          >
            Back to site
          </Link>
        </div>
      </div>
    </LoginCard>
  )
}
