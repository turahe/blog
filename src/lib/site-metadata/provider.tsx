'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { SiteMetadata } from './types'

const SiteMetadataContext = createContext<SiteMetadata | null>(null)

export function SiteMetadataProvider({
  value,
  children,
}: {
  value: SiteMetadata
  children: ReactNode
}) {
  return <SiteMetadataContext.Provider value={value}>{children}</SiteMetadataContext.Provider>
}

export function useSiteMetadata(): SiteMetadata {
  const metadata = useContext(SiteMetadataContext)
  if (!metadata) {
    throw new Error('useSiteMetadata must be used within SiteMetadataProvider')
  }
  return metadata
}
