export type PermissionItem = {
  id: string
  slug: string
  name: string
  group: string
  description?: string | null
}

export type PermissionGroup = {
  key: string
  label: string
  permissions: PermissionItem[]
}

export type RoleListItem = {
  id: string
  slug: string
  name: string
  description: string | null
  userCount: number
  permissionCount: number
  scope: 'system' | 'custom'
  updatedAt: string
}

export type RoleDetail = {
  id: string
  slug: string
  name: string
  description: string | null
  isSystem: boolean
  userCount: number
  permissionIds: string[]
  updatedAt: string
}

export type PermissionChangePreview = {
  added: PermissionItem[]
  removed: PermissionItem[]
  totalChanges: number
}

export type RoleMatrixRow = {
  permission: PermissionItem
  roleAccess: Record<string, boolean>
}

export type RbacAuditEntry = {
  id: string
  actorName: string
  actorEmail: string
  action: string
  summary: string
  createdAt: string
}
