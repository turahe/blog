interface AuthAlertProps {
  title?: string
  message: string
  variant?: 'error' | 'warning' | 'info' | 'success'
}

const variants = {
  error:
    'border-red-200 bg-red-50 text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300',
  warning:
    'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200',
  info: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-200',
  success:
    'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200',
}

export function AuthAlert({ title, message, variant = 'error' }: AuthAlertProps) {
  return (
    <div
      role="alert"
      className={`rounded-xl border px-4 py-3 text-sm transition-opacity duration-200 ${variants[variant]}`}
    >
      {title && <p className="mb-0.5 font-medium">{title}</p>}
      <p className={title ? 'text-[0.925rem] opacity-90' : ''}>{message}</p>
    </div>
  )
}
