import NewsletterForm from '@/components/ui/NewsletterForm'

export function NewsletterCard() {
  return (
    <section className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 dark:border-gray-800 dark:from-gray-900 dark:to-gray-950">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Stay in the loop</h2>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Get new articles delivered to your inbox. No spam, unsubscribe anytime.
      </p>
      <div className="mt-6">
        <NewsletterForm />
      </div>
    </section>
  )
}
