'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

interface SearchContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
}

const SearchContext = createContext<SearchContextValue | null>(null)

export function SearchContextProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const toggle = useCallback(() => setOpen((value) => !value), [])

  const value = useMemo(() => ({ open, setOpen, toggle }), [open, toggle])

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within SearchContextProvider')
  }
  return context
}
