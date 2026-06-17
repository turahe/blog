'use client'

import Image from 'next/image'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { formatFileSize } from '@/modules/media/constants'
import type { MediaItem } from '@/modules/media/types'

interface MediaPickerCardProps {
  item: MediaItem
  selected: boolean
  onSelect: (item: MediaItem) => void
}

export function MediaPickerCard({ item, selected, onSelect }: MediaPickerCardProps) {
  const thumb = item.variants?.thumbnail ?? item.url

  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className={`group relative overflow-hidden rounded-lg border-2 bg-white text-left transition dark:bg-gray-950 ${
        selected
          ? 'border-brand-500 ring-brand-500/25 ring-2'
          : 'hover:border-brand-300 border-gray-200 dark:border-gray-800'
      }`}
    >
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-900">
        <Image
          src={thumb}
          alt={item.altText ?? item.filename}
          fill
          className="object-cover"
          sizes="160px"
          unoptimized
        />
        {selected && (
          <span className="bg-brand-500 absolute top-2 right-2 rounded-full text-white shadow">
            <CheckCircleIcon className="h-6 w-6" />
          </span>
        )}
      </div>
      <div className="p-2">
        <p
          className="truncate text-xs font-medium text-gray-800 dark:text-gray-200"
          title={item.filename}
        >
          {item.filename}
        </p>
        <p className="text-[10px] text-gray-500">{formatFileSize(item.size)}</p>
      </div>
    </button>
  )
}
