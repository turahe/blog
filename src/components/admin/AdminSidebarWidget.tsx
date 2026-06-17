import Link from 'next/link'

export function AdminSidebarWidget() {
  return (
    <div className="mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/3">
      <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Blog Admin</h3>
      <p className="text-theme-sm mb-4 text-gray-500 dark:text-gray-400">
        Manage posts, users, and content with the TailAdmin dashboard layout.
      </p>
      <Link href="/" className="admin-btn-primary flex w-full items-center justify-center p-3">
        View site
      </Link>
    </div>
  )
}
