'use client'

import { MediaImageField } from '@/components/admin/media/MediaImageField'

interface ImageUploaderProps {
  label: string
  value: string
  onChange: (url: string) => void
  folder?: string
  hint?: string
}

export function ImageUploader({
  label,
  value,
  onChange,
  folder = 'settings',
  hint,
}: ImageUploaderProps) {
  return (
    <div>
      <MediaImageField label={label} value={value} onChange={onChange} folder={folder} />
      {hint && <p className="text-theme-xs mt-1 text-gray-500 dark:text-gray-400">{hint}</p>}
    </div>
  )
}
