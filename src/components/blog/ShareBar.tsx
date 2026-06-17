'use client'

import { useCallback, useState } from 'react'
import { LinkIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline'

interface ShareBarProps {
  url: string
  title: string
  vertical?: boolean
}

export function ShareBar({ url, title, vertical = false }: ShareBarProps) {
  const [copied, setCopied] = useState(false)

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }, [url])

  const encoded = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const links = [
    {
      label: 'Twitter',
      href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`,
    },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}` },
  ]

  const className = vertical
    ? 'hidden flex-col gap-2 lg:flex'
    : 'flex flex-wrap items-center gap-2 md:hidden'

  return (
    <div className={className}>
      <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        Share
      </p>
      <div className="flex flex-col gap-2">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900"
          >
            {link.label}
          </a>
        ))}
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900"
        >
          {copied ? (
            <ClipboardDocumentCheckIcon className="h-4 w-4" />
          ) : (
            <LinkIcon className="h-4 w-4" />
          )}
          {copied ? 'Copied' : 'Copy link'}
        </button>
      </div>
    </div>
  )
}
