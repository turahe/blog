'use client'

import type { TocHeading } from '@/types/post'

interface TableOfContentsProps {
  toc: TocHeading[]
}

export function TableOfContents({ toc }: TableOfContentsProps) {
  if (!toc.length) return null

  return (
    <nav aria-label="Table of contents" className="hidden lg:block">
      <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        On this page
      </p>
      <ul className="mt-3 max-h-[calc(100vh-8rem)] space-y-2 overflow-y-auto text-sm">
        {toc.map((item) => (
          <li key={item.url} style={{ paddingLeft: `${Math.max(0, item.level - 2) * 0.75}rem` }}>
            <a
              href={item.url}
              className="hover:text-primary-600 dark:hover:text-primary-400 text-gray-600 dark:text-gray-400"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
