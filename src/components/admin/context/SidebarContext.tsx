'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

interface SidebarContextValue {
  isExpanded: boolean
  isMobileOpen: boolean
  isHovered: boolean
  setIsHovered: (value: boolean) => void
  toggleSidebar: () => void
  toggleMobileSidebar: () => void
  closeMobileSidebar: () => void
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const toggleSidebar = useCallback(() => setIsExpanded((v) => !v), [])
  const toggleMobileSidebar = useCallback(() => setIsMobileOpen((v) => !v), [])
  const closeMobileSidebar = useCallback(() => setIsMobileOpen(false), [])

  const value = useMemo(
    () => ({
      isExpanded,
      isMobileOpen,
      isHovered,
      setIsHovered,
      toggleSidebar,
      toggleMobileSidebar,
      closeMobileSidebar,
    }),
    [isExpanded, isMobileOpen, isHovered, toggleSidebar, toggleMobileSidebar, closeMobileSidebar]
  )

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider')
  return ctx
}
