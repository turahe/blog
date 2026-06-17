import { getSession } from '@/lib/auth/session'
import { getCommentSettings, listApprovedCommentsForPost } from '@/modules/comments/services'
import { CommentThread } from './CommentThread'

export async function CommentSection({ postSlug }: { postSlug: string }) {
  const [settings, comments, session] = await Promise.all([
    getCommentSettings(),
    listApprovedCommentsForPost(postSlug),
    getSession(),
  ])

  if (!settings.enabled) return null

  return (
    <CommentThread
      postSlug={postSlug}
      initialComments={comments}
      settings={settings}
      isAuthenticated={Boolean(session)}
    />
  )
}
