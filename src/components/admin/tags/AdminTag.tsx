'use client'

import { forwardRef, useMemo } from 'react'
import type { AdminTagSize, AdminTagVariant, TagTone } from './types'
import { resolveVariantTone } from './semantic'
import { getTagClassName, truncateLabel } from './tag-styles'

export interface AdminTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string
  tone?: TagTone
  variant?: AdminTagVariant
  size?: AdminTagSize
  selected?: boolean
  disabled?: boolean
  truncateAt?: number
  interactive?: boolean
  removable?: boolean
  onRemove?: () => void
}

export const AdminTag = forwardRef<HTMLSpanElement, AdminTagProps>(function AdminTag(
  {
    label,
    tone,
    variant = 'status',
    size = 'compact',
    selected,
    disabled,
    truncateAt = 28,
    interactive,
    removable,
    onRemove,
    className,
    title,
    ...rest
  },
  ref
) {
  const resolvedTone = tone ?? resolveVariantTone(variant, label)
  const display = useMemo(() => truncateLabel(label, truncateAt), [label, truncateAt])
  const fullTitle = title ?? (display !== label ? label : undefined)

  const classes = getTagClassName(resolvedTone, variant, size, {
    selected,
    disabled,
    interactive: interactive || removable,
  })

  return (
    <span
      ref={ref}
      className={`${classes}${className ? ` ${className}` : ''}`}
      title={fullTitle}
      aria-disabled={disabled || undefined}
      {...rest}
    >
      <span className="truncate">{display}</span>
      {removable && !disabled && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.()
          }}
          className="focus-visible:ring-brand-500 ml-0.5 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm text-current/70 hover:bg-black/5 hover:text-current focus:outline-none focus-visible:ring-1 dark:hover:bg-white/10"
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </span>
  )
})
