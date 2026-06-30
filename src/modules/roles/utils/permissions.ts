import type { PermissionChangePreview, PermissionGroup, PermissionItem } from '../types'

export function groupPermissions(permissions: PermissionItem[]): PermissionGroup[] {
  const map = new Map<string, PermissionItem[]>()

  for (const permission of permissions) {
    const key = permission.group || 'general'
    const list = map.get(key) ?? []
    list.push(permission)
    map.set(key, list)
  }

  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, items]) => ({
      key,
      label: formatGroupLabel(key),
      permissions: items.sort((a, b) => a.name.localeCompare(b.name)),
    }))
}

export function formatGroupLabel(group: string): string {
  return group
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function diffPermissionIds(
  originalIds: string[],
  nextIds: string[],
  catalog: PermissionItem[]
): PermissionChangePreview {
  const original = new Set(originalIds)
  const next = new Set(nextIds)
  const byId = new Map(catalog.map((p) => [p.id, p]))

  const added = [...next].filter((id) => !original.has(id)).map((id) => byId.get(id)!)
  const removed = [...original].filter((id) => !next.has(id)).map((id) => byId.get(id)!)

  return {
    added: added.filter(Boolean),
    removed: removed.filter(Boolean),
    totalChanges: added.length + removed.length,
  }
}

export function filterPermissionGroups(
  groups: PermissionGroup[],
  query: string,
  activeGroup: string | null
): PermissionGroup[] {
  const normalized = query.trim().toLowerCase()

  return groups
    .filter((group) => !activeGroup || group.key === activeGroup)
    .map((group) => ({
      ...group,
      permissions: group.permissions.filter((permission) => {
        if (!normalized) return true
        return (
          permission.name.toLowerCase().includes(normalized) ||
          permission.slug.toLowerCase().includes(normalized) ||
          permission.group.toLowerCase().includes(normalized)
        )
      }),
    }))
    .filter((group) => group.permissions.length > 0)
}

export function debounce<T extends (...args: never[]) => void>(fn: T, ms: number) {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}
