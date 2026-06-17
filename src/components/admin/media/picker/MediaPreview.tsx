'use client'

import Image from 'next/image'
import type { MediaItem } from '@/modules/media/types'

interface MediaPreviewProps {
  item: MediaItem | null
  className?: string
}

export function MediaPreview({ item, className = '' }: MediaPreviewProps) {
  if (!item) {
    return (
      <div
        className={`flex aspect-video items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 ${className}`}
      >
        No image selected
      </div>
    )
  }

  return (
    <div
      className={`relative aspect-video overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <Image
        src={item.url}
        alt={item.altText ?? item.filename}
        fill
        className="object-contain"
        sizes="320px"
        unoptimized
      />
    </div>
  )
}
