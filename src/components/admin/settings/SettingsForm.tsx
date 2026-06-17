'use client'

import type { ReactNode } from 'react'

interface SettingsFormProps {
  children: ReactNode
  onSubmit?: () => void
}

/** Lightweight wrapper for grouped settings fields inside a card. */
export function SettingsForm({ children, onSubmit }: SettingsFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit?.()
      }}
      className="space-y-5"
    >
      {children}
    </form>
  )
}
