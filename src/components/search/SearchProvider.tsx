'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { KBarProvider } from 'kbar'
import { KBarModal } from './KBarModal'
import { formatDate } from '@/lib/formatDate'

interface SearchDocument {
  id: string
  name: string
  keywords?: string
  section?: string
  subtitle?: string
  url: string
}

interface KbarConfig {
  searchDocumentsPath?: string
}

function mapDocuments(docs: SearchDocument[], router: ReturnType<typeof useRouter>) {
  return docs.map((doc) => ({
    id: doc.id,
    name: doc.name,
    keywords: doc.keywords || '',
    section: doc.section || 'Content',
    subtitle: doc.subtitle || '',
    perform: () => router.push(doc.url),
  }))
}

function mapLegacyPosts(
  posts: { path: string; title: string; summary?: string; date: string }[],
  router: ReturnType<typeof useRouter>
) {
  return posts.map((post) => ({
    id: post.path,
    name: post.title,
    keywords: post.summary || '',
    section: 'Content',
    subtitle: formatDate(post.date, 'en-US'),
    perform: () => router.push(`/${post.path}`),
  }))
}

export function SearchProvider({
  kbarConfig,
  children,
}: {
  kbarConfig?: KbarConfig
  children: ReactNode
}) {
  const router = useRouter()
  const searchDocumentsPath = kbarConfig?.searchDocumentsPath
  const [searchActions, setSearchActions] = useState<ReturnType<typeof mapDocuments>>([])
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
          const actions =
            Array.isArray(json) && json[0] && 'url' in json[0]
              ? mapDocuments(json as SearchDocument[], router)
              : mapLegacyPosts(
                  json as { path: string; title: string; summary?: string; date: string }[],
                  router
                )
          setSearchActions(actions)
        }
      )
      .finally(() => setDataLoaded(true))
  }, [searchDocumentsPath, router])

  return (
    <KBarProvider actions={[]}>
      <KBarModal actions={searchActions} isLoading={!dataLoaded} />
      {children}
    </KBarProvider>
  )
}
