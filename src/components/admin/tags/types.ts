export type TagTone = 'neutral' | 'info' | 'success' | 'warning' | 'critical'

export type AdminTagVariant =
  | 'status'
  | 'category'
  | 'role'
  | 'permission'
  | 'environment'
  | 'metadata'

export type AdminTagSize = 'sm' | 'compact' | 'lg'

export type AdminTagItem = {
  id?: string
  label: string
  tone?: TagTone
  variant?: AdminTagVariant
  title?: string
  disabled?: boolean
}

export type FilterTagItem = {
  key: string
  label: string
  value: string
}
