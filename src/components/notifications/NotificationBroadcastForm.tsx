'use client'

import { useEffect, useState } from 'react'
import { ensureCsrfTokenAction } from '@/modules/auth/actions/csrf'
import { broadcastNotificationAction } from '@/modules/notifications/actions'
import type { BroadcastTarget } from '@/modules/notifications/types'

interface NotificationBroadcastFormProps {
  onSuccess?: (count: number) => void
}

export function NotificationBroadcastForm({ onSuccess }: NotificationBroadcastFormProps) {
  const [csrfToken, setCsrfToken] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [type, setType] = useState<'system_announcement' | 'maintenance_notice'>(
    'system_announcement'
  )
  const [targetMode, setTargetMode] = useState<BroadcastTarget['mode']>('all')
  const [roleSlugs, setRoleSlugs] = useState<string[]>(['admin'])
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ensureCsrfTokenAction()
      .then(setCsrfToken)
      .catch(() => {})
  }, [])

  const toggleRole = (slug: string) => {
    setRoleSlugs((prev) =>
      prev.includes(slug) ? prev.filter((value) => value !== slug) : [...prev, slug]
    )
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!csrfToken || !title.trim() || !message.trim()) return

    setSending(true)
    setError(null)

    const target: BroadcastTarget =
      targetMode === 'roles' ? { mode: 'roles', roleSlugs } : { mode: targetMode }

    const result = await broadcastNotificationAction(
      { title: title.trim(), message: message.trim(), type, target },
      csrfToken
    )

    setSending(false)

    if (!result.success) {
      setError(result.error ?? 'Failed to send broadcast')
      return
    }

    setTitle('')
    setMessage('')
    onSuccess?.(result.data?.count ?? 0)
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
      <div>
        <label className="admin-label" htmlFor="broadcast-type">
          Type
        </label>
        <select
          id="broadcast-type"
          className="admin-select mt-1.5 max-w-xs"
          value={type}
          onChange={(e) => setType(e.target.value as typeof type)}
        >
          <option value="system_announcement">System announcement</option>
          <option value="maintenance_notice">Maintenance notice</option>
        </select>
      </div>

      <div>
        <label className="admin-label" htmlFor="broadcast-title">
          Title
        </label>
        <input
          id="broadcast-title"
          className="admin-input mt-1.5"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Maintenance scheduled"
          maxLength={200}
          required
        />
      </div>

      <div>
        <label className="admin-label" htmlFor="broadcast-message">
          Message
        </label>
        <textarea
          id="broadcast-message"
          className="admin-textarea mt-1.5"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe the announcement for your team..."
          maxLength={2000}
          required
        />
      </div>

      <div>
        <label className="admin-label" htmlFor="broadcast-audience">
          Audience
        </label>
        <select
          id="broadcast-audience"
          className="admin-select mt-1.5 max-w-xs"
          value={targetMode}
          onChange={(e) => setTargetMode(e.target.value as BroadcastTarget['mode'])}
        >
          <option value="all">All users</option>
          <option value="roles">By role</option>
        </select>
      </div>

      {targetMode === 'roles' && (
        <div className="flex flex-wrap gap-3">
          {['superadmin', 'admin', 'operator'].map((slug) => (
            <label
              key={slug}
              className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
            >
              <input
                type="checkbox"
                className="admin-checkbox"
                checked={roleSlugs.includes(slug)}
                onChange={() => toggleRole(slug)}
              />
              <span className="capitalize">{slug}</span>
            </label>
          ))}
        </div>
      )}

      {error && <p className="text-error-600 dark:text-error-400 text-sm">{error}</p>}

      <button type="submit" disabled={sending || !csrfToken} className="admin-btn-primary">
        {sending ? 'Sending…' : 'Send broadcast'}
      </button>
    </form>
  )
}
