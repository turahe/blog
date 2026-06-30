import type { AdminTagVariant, TagTone } from './types'

const SUCCESS = new Set([
  'active',
  'approved',
  'published',
  'yes',
  'system',
  'enabled',
  'success',
  'live',
])

const WARNING = new Set(['pending', 'suspended', 'spam', 'warning', 'draft', 'review'])

const CRITICAL = new Set(['rejected', 'deleted', 'critical', 'danger', 'error', 'failed', 'banned'])

const INFO = new Set(['admin', 'custom', 'info', 'operator', 'superadmin'])

const NEUTRAL = new Set(['inactive', 'no', 'archived', 'disabled', 'unknown'])

export function resolveTagTone(value: string): TagTone {
  const key = value.trim().toLowerCase()
  if (SUCCESS.has(key)) return 'success'
  if (WARNING.has(key)) return 'warning'
  if (CRITICAL.has(key)) return 'critical'
  if (INFO.has(key)) return 'info'
  if (NEUTRAL.has(key)) return 'neutral'
  return 'neutral'
}

export function resolveVariantTone(variant: AdminTagVariant, value: string): TagTone {
  if (variant === 'role') return value.toLowerCase() === 'admin' ? 'info' : 'neutral'
  if (variant === 'permission') return 'neutral'
  if (variant === 'environment') {
    const env = value.toLowerCase()
    if (env === 'production') return 'critical'
    if (env === 'staging') return 'warning'
    return 'info'
  }
  if (variant === 'metadata') return 'neutral'
  if (variant === 'category') return 'info'
  return resolveTagTone(value)
}

export const FILTER_PARAM_LABELS: Record<string, string> = {
  status: 'Status',
  scope: 'Scope',
  draft: 'Draft',
  group: 'Group',
}

export const FILTER_EXCLUDED_PARAMS = new Set(['page', 'pageSize', 'search', 'sortBy', 'sortOrder'])
