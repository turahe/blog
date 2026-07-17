import { AdminTag } from './AdminTag'
import { resolveTagTone } from './semantic'
import type { AdminTagVariant } from './types'

/** Backward-compatible helper for status strings in tables */
export function StatusTag({
  label,
  variant = 'status',
}: {
  label: string
  variant?: AdminTagVariant
}) {
  return <AdminTag label={label} variant={variant} tone={resolveTagTone(label)} size="compact" />
}
