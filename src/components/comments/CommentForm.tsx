'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createCommentAction } from '@/modules/comments/actions'

interface CommentFormProps {
  postSlug: string
  parentId?: string
  guestEnabled: boolean
  isAuthenticated: boolean
  onSuccess?: () => void
  onCancel?: () => void
  submitLabel?: string
}

export function CommentForm({
  postSlug,
  parentId,
  guestEnabled,
  isAuthenticated,
  onSuccess,
  onCancel,
  submitLabel = 'Post comment',
}: CommentFormProps) {
  const [content, setContent] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [authorEmail, setAuthorEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  if (!isAuthenticated && !guestEnabled) {
    return (
      <p className="text-sm text-gray-600 dark:text-gray-400">
        <a href="/login" className="text-primary-600 dark:text-primary-400 font-medium">
          Sign in
        </a>{' '}
        to leave a comment.
      </p>
    )
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setMessage(null)

    startTransition(async () => {
      const result = await createCommentAction({
        postSlug,
        content,
        parentId,
        authorName: isAuthenticated ? undefined : authorName,
        authorEmail: isAuthenticated ? undefined : authorEmail,
      })

      if (!result.success) {
        setError(result.error ?? 'Failed to post comment')
        return
      }

      setContent('')
      setAuthorName('')
      setAuthorEmail('')
      setMessage(
        result.data?.status === 'PENDING'
          ? 'Your comment was submitted and is awaiting moderation.'
          : 'Your comment was posted.'
      )
      if (result.data?.status === 'APPROVED') {
        router.refresh()
      }
      onSuccess?.()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isAuthenticated && guestEnabled && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="comment-author-name"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Name
            </label>
            <input
              id="comment-author-name"
              className="admin-input w-full"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="comment-author-email"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              id="comment-author-email"
              type="email"
              className="admin-input w-full"
              value={authorEmail}
              onChange={(e) => setAuthorEmail(e.target.value)}
              required
            />
          </div>
        </div>
      )}

      <div>
        <label
          htmlFor="comment-content"
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Comment
        </label>
        <textarea
          id="comment-content"
          className="admin-textarea min-h-28 w-full"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {message && <p className="text-sm text-green-700 dark:text-green-400">{message}</p>}

      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={isPending} className="admin-btn-primary">
          {isPending ? 'Posting…' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="admin-btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
