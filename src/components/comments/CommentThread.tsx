'use client'

import { useState } from 'react'
import type { CommentItem, CommentSettings } from '@/modules/comments/types'
import { CommentForm } from './CommentForm'

function formatWhen(value: string) {
  return new Date(value).toLocaleString()
}

function CommentItemView({
  comment,
  postSlug,
  settings,
  isAuthenticated,
  depth = 0,
}: {
  comment: CommentItem
  postSlug: string
  settings: CommentSettings
  isAuthenticated: boolean
  depth?: number
}) {
  const [replying, setReplying] = useState(false)

  return (
    <li
      className={depth > 0 ? 'ml-4 border-l border-gray-200 pl-4 dark:border-gray-800' : undefined}
    >
      <article className="py-4">
        <header className="mb-2 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {comment.author.name}
          </span>
          <time dateTime={comment.createdAt}>{formatWhen(comment.createdAt)}</time>
        </header>
        <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">{comment.content}</p>
        {depth < 2 && (
          <button
            type="button"
            onClick={() => setReplying((value) => !value)}
            className="text-primary-600 dark:text-primary-400 mt-3 text-sm font-medium"
          >
            {replying ? 'Cancel reply' : 'Reply'}
          </button>
        )}
        {replying && (
          <div className="mt-4">
            <CommentForm
              postSlug={postSlug}
              parentId={comment.id}
              guestEnabled={settings.guestEnabled}
              isAuthenticated={isAuthenticated}
              submitLabel="Post reply"
              onCancel={() => setReplying(false)}
              onSuccess={() => setReplying(false)}
            />
          </div>
        )}
      </article>
      {comment.replies.length > 0 && (
        <ul className="space-y-1">
          {comment.replies.map((reply) => (
            <CommentItemView
              key={reply.id}
              comment={reply}
              postSlug={postSlug}
              settings={settings}
              isAuthenticated={isAuthenticated}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

export function CommentThread({
  postSlug,
  initialComments,
  settings,
  isAuthenticated,
}: {
  postSlug: string
  initialComments: CommentItem[]
  settings: CommentSettings
  isAuthenticated: boolean
}) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Comments ({initialComments.length})
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Join the discussion below.</p>
      </div>

      <CommentForm
        postSlug={postSlug}
        guestEnabled={settings.guestEnabled}
        isAuthenticated={isAuthenticated}
      />

      {initialComments.length > 0 ? (
        <ul className="divide-y divide-gray-200 dark:divide-gray-800">
          {initialComments.map((comment) => (
            <CommentItemView
              key={comment.id}
              comment={comment}
              postSlug={postSlug}
              settings={settings}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          No comments yet. Be the first to comment.
        </p>
      )}
    </div>
  )
}
