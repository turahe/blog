'use client'

import { ReactNode, useEffect, useState } from 'react'
import { CommandPalette, type SearchItem } from './CommandPalette'
import { SearchContextProvider } from './SearchContext'

interface SearchDocument {
  id: string
  name: string
  keywords?: string
  section?: string
  subtitle?: string
  url: string
}

function mapDocuments(docs: SearchDocument[]): SearchItem[] {
  return docs.map((doc) => ({
    id: doc.id,
    name: doc.name,
    keywords: doc.keywords || '',
    section: doc.section || 'Content',
    subtitle: doc.subtitle || '',
    url: doc.url,
  }))
}

export function SearchProvider({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  const [items, setItems] = useState<SearchItem[]>([])
  const [dataLoaded, setDataLoaded] = useState(!enabled)

  useEffect(() => {
    if (!enabled) return

    fetch('/api/search')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load search index')
        return res.json()
      })
      .then((json: SearchDocument[]) => setItems(mapDocuments(json)))
      .catch(() => setItems([]))
      .finally(() => setDataLoaded(true))
  }, [enabled])

  if (!enabled) {
    return <>{children}</>
  }

  return (
    <SearchContextProvider>
      <CommandPalette items={items} isLoading={!dataLoaded} />
      {children}
    </SearchContextProvider>
  )
}
