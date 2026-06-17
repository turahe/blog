'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { SETTINGS_NAV } from '@/modules/settings/config/defaults'
import type { SettingsSection } from '@/modules/settings/types'

export function SettingsSidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = (searchParams.get('tab') as SettingsSection) || 'general'

  return (
    <nav className="lg:sticky lg:top-24 lg:self-start">
      <ul className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:pb-0">
        {SETTINGS_NAV.map((item) => {
          const href = `${pathname}?tab=${item.id}`
          const isActive = active === item.id
          return (
            <li key={item.id} className="shrink-0 lg:shrink">
              <Link
                href={href}
                className={`block rounded-lg px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors lg:whitespace-normal ${
                  isActive
                    ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200'
                }`}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
