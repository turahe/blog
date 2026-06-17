'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRightOnRectangleIcon,
  BookOpenIcon,
  CommandLineIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  BellAlertIcon,
} from '@heroicons/react/24/outline'
import { logoutAction } from '@/modules/auth/actions/login'
import { ensureCsrfTokenAction } from '@/modules/auth/actions/csrf'
import type { AdminHeaderUser } from '@/components/admin/header/types'
import { AdminUserAvatar } from '@/components/admin/header/AdminUserAvatar'
import { AdminDropdownPanel } from '@/components/admin/header/AdminDropdownPanel'
import {
  AdminMenuDivider,
  AdminMenuItem,
  AdminMenuSection,
} from '@/components/admin/header/AdminMenuItem'
import { AppearanceSubmenu } from '@/components/admin/header/AppearanceSubmenu'
import { KeyboardShortcutsDialog } from '@/components/admin/header/KeyboardShortcutsDialog'
import { useAdminDropdown } from '@/components/admin/header/useAdminDropdown'

interface AdminUserMenuProps {
  user: AdminHeaderUser
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export function AdminUserMenu({ user, isOpen, onOpen, onClose }: AdminUserMenuProps) {
  const router = useRouter()
  const { containerRef, triggerRef, menuId } = useAdminDropdown(isOpen, onClose)
  const [csrfToken, setCsrfToken] = useState<string | null>(null)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)

  useEffect(() => {
    ensureCsrfTokenAction()
      .then(setCsrfToken)
      .catch(() => {})
  }, [])

  const lastLogin = user.lastLoginLabel

  const handleToggle = () => {
    if (isOpen) {
      onClose()
    } else {
      onOpen()
    }
  }

  const handleLogout = async () => {
    if (!csrfToken) return
    onClose()
    await logoutAction(csrfToken)
    router.push('/login')
    router.refresh()
  }

  const handleMenuAction = (action: () => void) => {
    onClose()
    action()
  }

  return (
    <>
      <div ref={containerRef} className="relative">
        <button
          ref={triggerRef}
          type="button"
          onClick={handleToggle}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-controls={menuId}
          className={`flex items-center gap-2.5 rounded-xl px-1.5 py-1.5 transition duration-150 ease-out sm:px-2 ${
            isOpen
              ? 'bg-gray-100 ring-1 ring-gray-200 dark:bg-white/8 dark:ring-gray-700'
              : 'hover:bg-gray-50 dark:hover:bg-white/5'
          }`}
        >
          <AdminUserAvatar name={user.fullName} avatar={user.avatar} size="md" />
          <span className="hidden min-w-0 text-left md:block">
            <span className="text-theme-sm block truncate font-medium text-gray-900 dark:text-white/90">
              {user.fullName}
            </span>
            <span className="text-theme-xs hidden truncate text-gray-500 lg:block dark:text-gray-400">
              {user.primaryRole}
            </span>
          </span>
          <span className="sr-only">Open user menu</span>
        </button>

        <AdminDropdownPanel id={menuId} isOpen={isOpen}>
          <div className="rounded-lg bg-linear-to-b from-gray-50 to-white px-3 py-4 dark:from-white/4 dark:to-transparent">
            <div className="flex items-start gap-3">
              <AdminUserAvatar name={user.fullName} avatar={user.avatar} size="lg" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                  {user.fullName}
                </p>
                <p className="text-theme-xs mt-0.5 truncate text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
                <span className="bg-brand-50 text-theme-xs text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 mt-2 inline-flex rounded-full px-2.5 py-0.5 font-medium">
                  {user.primaryRole}
                </span>
              </div>
            </div>

            {(lastLogin || user.memberSince) && (
              <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-gray-200/80 pt-3 dark:border-gray-800">
                {lastLogin && (
                  <div>
                    <dt className="text-[11px] font-medium tracking-wide text-gray-400 uppercase">
                      Last login
                    </dt>
                    <dd className="text-theme-xs mt-0.5 text-gray-600 dark:text-gray-300">
                      {lastLogin}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-[11px] font-medium tracking-wide text-gray-400 uppercase">
                    Member since
                  </dt>
                  <dd className="text-theme-xs mt-0.5 text-gray-600 dark:text-gray-300">
                    {user.memberSinceLabel}
                  </dd>
                </div>
              </dl>
            )}
          </div>

          <AdminMenuSection>
            <AdminMenuItem
              icon={UserCircleIcon}
              label="My Profile"
              href="/account/profile"
              onClick={onClose}
            />
            <AdminMenuItem
              icon={Cog6ToothIcon}
              label="Account Settings"
              href="/account/preferences"
              onClick={onClose}
            />
            <AppearanceSubmenu onSelect={onClose} />
            <AdminMenuItem
              icon={BellAlertIcon}
              label="Notifications"
              href="/account/notifications"
              onClick={onClose}
            />
          </AdminMenuSection>

          <AdminMenuDivider />

          <AdminMenuSection>
            <AdminMenuItem
              icon={BookOpenIcon}
              label="Documentation"
              href="https://github.com/turahe/blog"
              onClick={onClose}
            />
            <AdminMenuItem
              icon={CommandLineIcon}
              label="Keyboard Shortcuts"
              onClick={() => handleMenuAction(() => setShortcutsOpen(true))}
            />
          </AdminMenuSection>

          <AdminMenuDivider />

          <AdminMenuSection>
            <AdminMenuItem
              icon={ArrowRightOnRectangleIcon}
              label="Logout"
              onClick={handleLogout}
              destructive
            />
          </AdminMenuSection>
        </AdminDropdownPanel>
      </div>

      <KeyboardShortcutsDialog open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </>
  )
}
