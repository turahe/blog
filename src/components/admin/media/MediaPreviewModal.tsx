'use client'

import { useEffect, useCallback, useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import { isImageMime } from '@/modules/media/constants'
import type { MediaItem } from '@/modules/media/types'

interface MediaPreviewModalProps {
  item: MediaItem | null
  items: MediaItem[]
  onClose: () => void
  onNavigate: (item: MediaItem) => void
}

export function MediaPreviewModal({ item, items, onClose, onNavigate }: MediaPreviewModalProps) {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const imageItems = items.filter((i) => isImageMime(i.mimeType) || i.mimeType.startsWith('video/'))
  const currentIndex = item ? imageItems.findIndex((i) => i.id === item.id) : -1

  const goPrev = useCallback(() => {
    if (currentIndex > 0) onNavigate(imageItems[currentIndex - 1]!)
  }, [currentIndex, imageItems, onNavigate])

  const goNext = useCallback(() => {
    if (currentIndex < imageItems.length - 1) onNavigate(imageItems[currentIndex + 1]!)
  }, [currentIndex, imageItems, onNavigate])

  useEffect(() => {
    if (!item) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [item, onClose, goPrev, goNext])

  useEffect(() => {
    setZoom(1)
    setRotation(0)
  }, [item?.id])

  if (!item) return null

  return (
    <Dialog open={!!item} onClose={onClose} className="relative z-[200]">
      <DialogBackdrop className="fixed inset-0 bg-gray-950/90" />
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <DialogPanel className="relative flex max-h-[90vh] w-full max-w-5xl flex-col">
          <div className="mb-4 flex items-center justify-between text-white">
            <p className="truncate text-sm font-medium">{item.filename}</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
                className="rounded-lg p-2 hover:bg-white/10"
              >
                <MagnifyingGlassPlusIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
                className="rounded-lg p-2 hover:bg-white/10"
              >
                <MagnifyingGlassMinusIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setRotation((r) => r + 90)}
                className="rounded-lg p-2 hover:bg-white/10"
              >
                <ArrowPathIcon className="h-5 w-5" />
              </button>
              <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-white/10">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="relative flex flex-1 items-center justify-center overflow-hidden">
            {currentIndex > 0 && (
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-0 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
            )}
            {isImageMime(item.mimeType) ? (
              <div
                style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
                className="transition-transform"
              >
                <Image
                  src={item.url}
                  alt={item.altText ?? item.filename}
                  width={item.width ?? 1200}
                  height={item.height ?? 800}
                  className="max-h-[70vh] w-auto object-contain"
                  unoptimized
                />
              </div>
            ) : item.mimeType.startsWith('video/') ? (
              <video src={item.url} controls className="max-h-[70vh] max-w-full">
                <track kind="captions" />
              </video>
            ) : (
              <p className="text-white">Preview not available for this file type</p>
            )}
            {currentIndex < imageItems.length - 1 && (
              <button
                type="button"
                onClick={goNext}
                className="absolute right-0 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
