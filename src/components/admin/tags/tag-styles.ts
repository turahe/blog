import type { AdminTagSize, AdminTagVariant, TagTone } from './types'

const toneClasses: Record<TagTone, string> = {
  neutral:
    'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-300',
  info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300',
  success:
    'border-green-200 bg-green-50 text-green-800 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300',
  warning:
    'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200',
  critical:
    'border-red-200 bg-red-50 text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300',
}

const sizeClasses: Record<AdminTagSize, string> = {
  sm: 'text-[10px] leading-4 px-1.5 py-0 gap-1',
  compact: 'text-theme-xs leading-4 px-2 py-0.5 gap-1',
  lg: 'text-theme-sm leading-5 px-2.5 py-1 gap-1.5',
}

const variantClasses: Record<AdminTagVariant, string> = {
  status: 'rounded-md border font-medium',
  category: 'rounded-md border font-medium',
  role: 'rounded-md border font-medium',
  permission: 'rounded border font-mono font-normal',
  environment: 'rounded border border-dashed font-medium',
  metadata: 'rounded border font-normal text-gray-600 dark:text-gray-400',
}

export function getTagClassName(
  tone: TagTone,
  variant: AdminTagVariant,
  size: AdminTagSize,
  {
    selected,
    disabled,
    interactive,
  }: { selected?: boolean; disabled?: boolean; interactive?: boolean } = {}
): string {
  const base = [
    'inline-flex max-w-full items-center truncate align-middle',
    sizeClasses[size],
    variantClasses[variant],
    toneClasses[tone],
  ]

  if (interactive && !disabled) {
    base.push('cursor-pointer transition-colors hover:brightness-95 dark:hover:brightness-110')
  }

  if (selected) {
    base.push('ring-2 ring-brand-500/40 ring-offset-1 dark:ring-offset-gray-900')
  }

  if (disabled) {
    base.push('cursor-not-allowed opacity-50')
  }

  return base.join(' ')
}

export function truncateLabel(label: string, max = 24): string {
  if (label.length <= max) return label
  return `${label.slice(0, max - 1)}…`
}

export function formatGroupLabel(group: string): string {
  return group
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}
