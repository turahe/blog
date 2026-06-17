'use client'

import { useSidebar } from '@/components/admin/context/SidebarContext'

export function AdminBackdrop() {
  const { isMobileOpen, closeMobileSidebar } = useSidebar()

  if (!isMobileOpen) return null

  return (
    <button
      type="button"
      aria-label="Close navigation menu"
      className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
      onClick={closeMobileSidebar}
    />
  )
}
