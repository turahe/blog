'use client'

import type { ReactNode } from 'react'

interface AdminDropdownPanelProps {
  id: string
  isOpen: boolean
  widthClass?: string
  align?: 'left' | 'right'
  children: ReactNode
}

export function AdminDropdownPanel({
  id,
  isOpen,
  widthClass = 'w-[280px]',
  align = 'right',
  children,
}: AdminDropdownPanelProps) {
  return (
    <div
      id={id}
      role="menu"
      aria-hidden={!isOpen}
      className={`absolute top-[calc(100%+8px)] z-50 ${align === 'right' ? 'right-0' : 'left-0'} ${widthClass} origin-top-right rounded-xl border border-gray-200/80 bg-white p-1.5 shadow-lg ring-1 shadow-gray-900/8 ring-gray-900/5 transition duration-150 ease-out dark:border-gray-700/80 dark:bg-gray-900 dark:shadow-black/40 dark:ring-white/10 ${
        isOpen
          ? 'pointer-events-auto scale-100 opacity-100'
          : 'pointer-events-none scale-95 opacity-0'
      }`}
    >
      {children}
    </div>
  )
}
