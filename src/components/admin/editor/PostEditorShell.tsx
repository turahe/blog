'use client'

import type { ReactNode } from 'react'

interface PostEditorShellProps {
  header: ReactNode
  main: ReactNode
  sidebar: ReactNode
}

export function PostEditorShell({ header, main, sidebar }: PostEditorShellProps) {
  return (
    <div className="-mx-4 flex min-h-[calc(100vh-8rem)] flex-col lg:-mx-6">
      <div className="shrink-0 border-b border-gray-200 bg-white px-4 py-3 lg:px-6 dark:border-gray-800 dark:bg-gray-900">
        {header}
      </div>
      <div className="grid flex-1 gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 border-r border-gray-200 p-4 lg:p-6 dark:border-gray-800">
          {main}
        </div>
        <aside className="bg-gray-50 p-4 lg:p-6 dark:bg-gray-900/40">{sidebar}</aside>
      </div>
    </div>
  )
}
