'use client'

import { useState } from 'react'
import type { AdminHeaderUser } from '@/components/admin/header/types'
import { NotificationBell } from '@/components/notifications'
import { AdminUserMenu } from '@/components/admin/header/AdminUserMenu'
import { AdminThemeToggle } from '@/components/admin/header/AdminThemeToggle'

type OpenPanel = 'user' | 'notifications' | null

interface AdminHeaderActionsProps {
  user: AdminHeaderUser
}

export function AdminHeaderActions({ user }: AdminHeaderActionsProps) {
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null)

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <AdminThemeToggle />
      <NotificationBell
        isOpen={openPanel === 'notifications'}
        onOpen={() => setOpenPanel('notifications')}
        onClose={() => setOpenPanel(null)}
      />
      <AdminUserMenu
        user={user}
        isOpen={openPanel === 'user'}
        onOpen={() => setOpenPanel('user')}
        onClose={() => setOpenPanel(null)}
      />
    </div>
  )
}
