'use client'

import { Suspense, type ReactNode } from 'react'
import { SidebarProvider, useSidebar } from '@/components/admin/context/SidebarContext'
import { AdminBackdrop } from '@/components/admin/AdminBackdrop'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminTopNav'
import { NotificationProvider } from '@/components/notifications'

import type { AdminHeaderUser } from '@/lib/admin/get-header-user'

interface AdminShellProps {
  children: ReactNode
  user: AdminHeaderUser
}

function AdminLayoutContent({ children, user }: AdminShellProps) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar()

  const mainContentMargin = isMobileOpen
    ? 'ml-0'
    : isExpanded || isHovered
      ? 'lg:ml-[290px]'
      : 'lg:ml-[90px]'

  return (
    <div
      data-admin-theme
      className="fixed inset-0 z-[100] min-h-screen bg-gray-50 xl:flex dark:bg-gray-900"
    >
      <Suspense fallback={null}>
        <AdminSidebar />
      </Suspense>
      <AdminBackdrop />
      <div
        className={`flex min-h-0 flex-1 flex-col transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        <AdminHeader user={user} />
        <div className="custom-scrollbar mx-auto min-h-0 w-full max-w-(--breakpoint-2xl) flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export function AdminShell({ children, user }: AdminShellProps) {
  return (
    <SidebarProvider>
      <NotificationProvider userId={user.id}>
        <AdminLayoutContent user={user}>{children}</AdminLayoutContent>
      </NotificationProvider>
    </SidebarProvider>
  )
}
