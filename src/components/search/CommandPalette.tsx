'use client'

import { Command } from 'cmdk'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useSearch } from './SearchContext'

export interface SearchItem {
  id: string
  name: string
  keywords?: string
  section?: string
  subtitle?: string
  url: string
}

interface CommandPaletteProps {
  items: SearchItem[]
  isLoading: boolean
}

export function CommandPalette({ items, isLoading }: CommandPaletteProps) {
  const { open, setOpen, toggle } = useSearch()
  const router = useRouter()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggle()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [toggle])

  const sections = items.reduce<Map<string, SearchItem[]>>((groups, item) => {
    const section = item.section || 'Content'
    const existing = groups.get(section) ?? []
    existing.push(item)
    groups.set(section, existing)
    return groups
  }, new Map())

  const handleSelect = (url: string) => {
    setOpen(false)
    router.push(url)
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Search"
      className="fixed inset-0 z-50"
    >
      <div
        className="fixed inset-0 bg-gray-300/50 backdrop-blur backdrop-filter dark:bg-black/50"
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh] sm:p-6">
        <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-xl dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-3 border-b border-gray-100 px-4 dark:border-gray-800">
            <svg
              className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Command.Input
              placeholder="Search articles..."
              className="h-14 w-full bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none dark:text-gray-200 dark:placeholder-gray-500"
            />
            <kbd className="hidden rounded border border-gray-300 px-1.5 py-0.5 text-xs text-gray-400 sm:inline-block dark:border-gray-700">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-[min(24rem,50vh)] overflow-y-auto p-2">
            {isLoading ? (
              <div className="px-3 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
                Loading...
              </div>
            ) : (
              <>
                <Command.Empty className="px-3 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
                  No results for your search...
                </Command.Empty>
                {[...sections.entries()].map(([section, sectionItems]) => (
                  <Command.Group
                    key={section}
                    heading={section}
                    className="[&_[cmdk-group-heading]]:text-primary-600 px-2 py-2 text-xs font-semibold tracking-wide uppercase [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-2"
                  >
                    {sectionItems.map((item) => (
                      <Command.Item
                        key={item.id}
                        value={`${item.name} ${item.keywords ?? ''} ${item.subtitle ?? ''}`}
                        onSelect={() => handleSelect(item.url)}
                        className="group data-[selected=true]:bg-primary-600 flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-700 data-[selected=true]:text-gray-100 dark:text-gray-100"
                      >
                        <div className="min-w-0">
                          {item.subtitle && (
                            <div className="truncate text-xs text-gray-400 group-data-[selected=true]:text-gray-200">
                              {item.subtitle}
                            </div>
                          )}
                          <div className="truncate font-medium">{item.name}</div>
                        </div>
                      </Command.Item>
                    ))}
                  </Command.Group>
                ))}
              </>
            )}
          </Command.List>
        </div>
      </div>
    </Command.Dialog>
  )
}
