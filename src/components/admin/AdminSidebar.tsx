'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSiteMetadata } from '@/lib/site-metadata/provider'
import { useSidebar } from '@/components/admin/context/SidebarContext'
import { logoutAction } from '@/modules/auth/actions/login'
import { ensureCsrfTokenAction } from '@/modules/auth/actions/csrf'
import {
  Squares2X2Icon,
  Cog6ToothIcon,
  DocumentTextIcon,
  RectangleStackIcon,
  PhotoIcon,
  ChatBubbleLeftRightIcon,
  GlobeAltIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  EllipsisHorizontalIcon,
  UsersIcon,
  TagIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  KeyIcon,
  ClipboardDocumentListIcon,
  BuildingOffice2Icon,
} from '@heroicons/react/24/outline'
import type { ComponentType } from 'react'

interface NavLinkItem {
  type: 'link'
  href: string
  label: string
  icon: ComponentType<{ className?: string }>
  match?: (pathname: string, tab: string | null) => boolean
}

interface NavDividerItem {
  type: 'divider'
}

interface NavLogoutItem {
  type: 'logout'
  label: string
  icon: ComponentType<{ className?: string }>
}

type NavItem = NavLinkItem | NavDividerItem | NavLogoutItem

interface NavSection {
  title: string
  items: NavLinkItem[]
}

const navSections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      {
        href: '/admin',
        label: 'Dashboard',
        icon: Squares2X2Icon,
        type: 'link',
        match: (pathname) => pathname === '/admin',
      },
    ],
  },
  {
    title: 'Content',
    items: [
      {
        href: '/admin/posts',
        label: 'Posts',
        icon: DocumentTextIcon,
        type: 'link',
        match: (pathname) => pathname.startsWith('/admin/posts'),
      },
      {
        href: '/admin/categories',
        label: 'Categories',
        icon: RectangleStackIcon,
        type: 'link',
        match: (pathname) => pathname.startsWith('/admin/categories'),
      },
      {
        href: '/admin/tags',
        label: 'Tags',
        icon: TagIcon,
        type: 'link',
        match: (pathname) => pathname.startsWith('/admin/tags'),
      },
      {
        href: '/admin/media',
        label: 'Media Library',
        icon: PhotoIcon,
        type: 'link',
        match: (pathname) => pathname.startsWith('/admin/media'),
      },
      {
        href: '/admin/comments',
        label: 'Comments',
        icon: ChatBubbleLeftRightIcon,
        type: 'link',
        match: (pathname) => pathname.startsWith('/admin/comments'),
      },
    ],
  },
  {
    title: 'Portfolio',
    items: [
      {
        href: '/admin/projects',
        label: 'Projects',
        icon: RocketLaunchIcon,
        type: 'link',
        match: (pathname) => pathname.startsWith('/admin/projects'),
      },
      {
        href: '/admin/experience',
        label: 'Experience',
        icon: BuildingOffice2Icon,
        type: 'link',
        match: (pathname) => pathname.startsWith('/admin/experience'),
      },
    ],
  },
  {
    title: 'Users & Access',
    items: [
      {
        href: '/admin/users',
        label: 'Users',
        icon: UsersIcon,
        type: 'link',
        match: (pathname) => pathname.startsWith('/admin/users'),
      },
      {
        href: '/admin/roles',
        label: 'Roles',
        icon: ShieldCheckIcon,
        type: 'link',
        match: (pathname) => pathname.startsWith('/admin/roles'),
      },
      {
        href: '/admin/permissions',
        label: 'Permissions',
        icon: KeyIcon,
        type: 'link',
        match: (pathname) => pathname.startsWith('/admin/permissions'),
      },
    ],
  },
  {
    title: 'System',
    items: [
      {
        href: '/admin/audit-logs',
        label: 'Audit Logs',
        icon: ClipboardDocumentListIcon,
        type: 'link',
        match: (pathname) => pathname.startsWith('/admin/audit-logs'),
      },
      {
        href: '/admin/settings',
        label: 'Settings',
        icon: Cog6ToothIcon,
        type: 'link',
        match: (pathname, tab) => pathname === '/admin/settings' && (!tab || tab === 'general'),
      },
    ],
  },
]

const footerMenuItems: NavItem[] = [
  { type: 'divider' },
  {
    type: 'link',
    href: '/account/profile',
    label: 'My Profile',
    icon: UserCircleIcon,
    match: (pathname) => pathname.startsWith('/account'),
  },
  { type: 'divider' },
  {
    type: 'logout',
    label: 'Logout',
    icon: ArrowRightOnRectangleIcon,
  },
]

function isActive(item: NavLinkItem, pathname: string, tab: string | null): boolean {
  if (item.match) return item.match(pathname, tab)
  return pathname === item.href || pathname.startsWith(`${item.href}/`)
}

export function AdminSidebar() {
  const siteMetadata = useSiteMetadata()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const settingsTab = searchParams.get('tab')
  const { isExpanded, isHovered, isMobileOpen, setIsHovered, closeMobileSidebar } = useSidebar()
  const [csrfToken, setCsrfToken] = useState<string | null>(null)

  useEffect(() => {
    ensureCsrfTokenAction()
      .then(setCsrfToken)
      .catch(() => {})
  }, [])

  const showLabels = isExpanded || isHovered || isMobileOpen
  const widthClass = isExpanded || isMobileOpen ? 'w-[290px]' : isHovered ? 'w-[290px]' : 'w-[90px]'

  const handleLogout = async () => {
    if (!csrfToken) return
    closeMobileSidebar()
    await logoutAction(csrfToken)
    router.push('/login')
    router.refresh()
  }

  const renderLink = (item: NavLinkItem) => {
    const active = isActive(item, pathname, settingsTab)
    const Icon = item.icon

    return (
      <li key={item.href}>
        <Link
          href={item.href}
          onClick={closeMobileSidebar}
          title={!showLabels ? item.label : undefined}
          className={`menu-item group ${active ? 'menu-item-active' : 'menu-item-inactive'} ${
            showLabels ? '' : 'lg:justify-center'
          }`}
        >
          <Icon
            className={`size-5 shrink-0 ${
              active ? 'menu-item-icon-active' : 'menu-item-icon-inactive'
            }`}
          />
          {showLabels && <span>{item.label}</span>}
        </Link>
      </li>
    )
  }

  const renderFooterItem = (item: NavItem, index: number) => {
    if (item.type === 'divider') {
      return (
        <li key={`divider-${index}`} aria-hidden="true">
          <div className="my-2 border-t border-gray-200 dark:border-gray-800" />
        </li>
      )
    }

    if (item.type === 'logout') {
      const Icon = item.icon
      return (
        <li key="logout">
          <button
            type="button"
            onClick={handleLogout}
            disabled={!csrfToken}
            title={!showLabels ? item.label : undefined}
            className={`menu-item group menu-item-inactive text-error-600 hover:bg-error-50 hover:text-error-700 dark:text-error-400 dark:hover:bg-error-500/10 dark:hover:text-error-300 w-full text-left ${
              showLabels ? '' : 'lg:justify-center'
            }`}
          >
            <Icon className="size-5 shrink-0 opacity-80" />
            {showLabels && <span>{item.label}</span>}
          </button>
        </li>
      )
    }

    return renderLink(item)
  }

  return (
    <aside
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed top-0 left-0 z-50 flex h-screen flex-col border-r border-gray-200 bg-white px-5 text-gray-900 transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 ${widthClass} ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className={`flex py-8 ${showLabels ? 'justify-start' : 'lg:justify-center'}`}>
        <Link href="/admin" onClick={closeMobileSidebar} className="flex items-center gap-2.5">
          <span className="bg-brand-500 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white">
            W
          </span>
          {showLabels && (
            <span className="text-lg font-semibold text-gray-900 dark:text-white/90">
              {siteMetadata.headerTitle}
            </span>
          )}
        </Link>
      </div>

      <div className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="flex flex-1 flex-col">
          <h2
            className={`mb-4 flex text-xs leading-5 font-semibold tracking-wide text-gray-400 uppercase ${
              showLabels ? 'justify-start' : 'lg:justify-center'
            }`}
          >
            {showLabels ? 'Menu' : <EllipsisHorizontalIcon className="h-4 w-4" />}
          </h2>

          <div className="flex flex-col gap-6">
            {navSections.map((section) => (
              <div key={section.title}>
                {showLabels ? (
                  <h3 className="mb-2 px-3 text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
                    {section.title}
                  </h3>
                ) : null}
                <ul className="flex flex-col gap-1">
                  {section.items.map((item) => renderLink(item))}
                </ul>
              </div>
            ))}
          </div>

          <ul className="mt-auto flex flex-col gap-1 pt-4 pb-6">
            {footerMenuItems.map((item, index) => renderFooterItem(item, index))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
