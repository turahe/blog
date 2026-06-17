'use client'

import { ReactNode, useEffect, useState } from 'react'
import { formatDate } from '@/lib/formatDate'
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

interface SearchConfig {
  searchDocumentsPath?: string
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

function mapLegacyPosts(
  posts: { path: string; title: string; summary?: string; date: string }[]
): SearchItem[] {
  return posts.map((post) => ({
    id: post.path,
    name: post.title,
    keywords: post.summary || '',
    section: 'Content',
    subtitle: formatDate(post.date, 'en-US'),
    url: `/${post.path}`,
  }))
}

export function SearchProvider({
  searchConfig,
  children,
}: {
  searchConfig?: SearchConfig
  children: ReactNode
}) {
  const searchDocumentsPath = searchConfig?.searchDocumentsPath
  const [items, setItems] = useState<SearchItem[]>([])
  const [dataLoaded, setDataLoaded] = useState(!searchDocumentsPath)

  useEffect(() => {
    if (!searchDocumentsPath) return

    const url =
      searchDocumentsPath.includes('://') || searchDocumentsPath.startsWith('//')
        ? searchDocumentsPath
        : new URL(searchDocumentsPath, window.location.origin).toString()

    fetch(url)
      .then((res) => res.json())
      .then(
        (
          json: SearchDocument[] | { path: string; title: string; summary?: string; date: string }[]
        ) => {
          const nextItems =
            Array.isArray(json) && json[0] && 'url' in json[0]
              ? mapDocuments(json as SearchDocument[])
              : mapLegacyPosts(
                  json as { path: string; title: string; summary?: string; date: string }[]
                )
          setItems(nextItems)
        }
      )
      .finally(() => setDataLoaded(true))
  }, [searchDocumentsPath])

  return (
    <SearchContextProvider>
      <CommandPalette items={items} isLoading={!dataLoaded} />
      {children}
    </SearchContextProvider>
  )
}
