'use client'

import { useRef, useState } from 'react'
import { AdminUserAvatar } from '@/components/admin/header/AdminUserAvatar'

interface AvatarUploadFieldProps {
  name: string
  avatar: string | null
  onChange: (url: string | null) => void
  onRemove: () => void
}

export function AvatarUploadField({ name, avatar, onChange, onRemove }: AvatarUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [cropOpen, setCropOpen] = useState(false)
  const [source, setSource] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFile = (file: File | null) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setSource(reader.result as string)
      setCropOpen(true)
    }
    reader.readAsDataURL(file)
  }

  const applyCrop = () => {
    const canvas = canvasRef.current
    const image = new Image()
    if (!canvas || !source) return

    image.onload = () => {
      const size = 256
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const min = Math.min(image.width, image.height)
      const sx = (image.width - min) / 2
      const sy = (image.height - min) / 2
      ctx.drawImage(image, sx, sy, min, min, 0, 0, size, size)
      onChange(canvas.toDataURL('image/jpeg', 0.9))
      setCropOpen(false)
      setSource(null)
    }
    image.src = source
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <AdminUserAvatar name={name} avatar={avatar} size="lg" />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="admin-btn-secondary"
          onClick={() => inputRef.current?.click()}
        >
          Upload avatar
        </button>
        {avatar && (
          <button type="button" className="admin-btn-secondary" onClick={onRemove}>
            Remove
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </div>

      {cropOpen && source && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-gray-900/50"
            aria-label="Close crop dialog"
            onClick={() => setCropOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Crop avatar</h3>
            <p className="text-theme-sm mt-1 text-gray-500">
              Square crop will be applied automatically.
            </p>
            <img
              src={source}
              alt="Crop preview"
              className="mt-4 max-h-64 w-full rounded-xl object-contain"
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={() => setCropOpen(false)}
              >
                Cancel
              </button>
              <button type="button" className="admin-btn-primary" onClick={applyCrop}>
                Apply crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
