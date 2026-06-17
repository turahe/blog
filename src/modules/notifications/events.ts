import { notifyUser, notifyUsersWithPermission } from './services/notify'

export async function emitNewComment(input: {
  authorName: string
  postId: string
  postTitle: string
  commentId: string
}) {
  await notifyUsersWithPermission('comments.moderate', {
    type: 'new_comment',
    title: 'New Comment',
    message: `${input.authorName} commented on "${input.postTitle}"`,
    data: {
      commentId: input.commentId,
      postId: input.postId,
      postTitle: input.postTitle,
      actorName: input.authorName,
    },
  })
}

export async function emitCommentModerated(input: {
  userId: string
  status: 'APPROVED' | 'SPAM' | 'TRASH'
  postTitle: string
  commentId: string
}) {
  if (input.status === 'APPROVED') {
    await notifyUser({
      userId: input.userId,
      type: 'comment_approved',
      title: 'Comment Approved',
      message: `Your comment on "${input.postTitle}" was approved.`,
      data: { commentId: input.commentId, postTitle: input.postTitle },
    })
    return
  }

  if (input.status === 'SPAM' || input.status === 'TRASH') {
    await notifyUser({
      userId: input.userId,
      type: 'comment_rejected',
      title: 'Comment Rejected',
      message: `Your comment on "${input.postTitle}" was not approved.`,
      data: { commentId: input.commentId, postTitle: input.postTitle },
    })
  }
}

export async function emitPostPublished(input: {
  postId: string
  postTitle: string
  actorName?: string
}) {
  await notifyUsersWithPermission('posts.update', {
    type: 'post_published',
    title: 'Post Published',
    message: input.actorName
      ? `${input.actorName} published "${input.postTitle}"`
      : `"${input.postTitle}" is now live.`,
    data: { postId: input.postId, postTitle: input.postTitle },
  })
}

export async function emitPostScheduled(input: {
  postId: string
  postTitle: string
  scheduledAt: string
}) {
  await notifyUsersWithPermission('posts.update', {
    type: 'post_scheduled',
    title: 'Post Scheduled',
    message: `"${input.postTitle}" is scheduled for publication.`,
    data: { postId: input.postId, postTitle: input.postTitle, scheduledAt: input.scheduledAt },
  })
}

export async function emitNewUserRegistered(input: {
  userId: string
  fullName: string
  email: string
}) {
  await notifyUsersWithPermission('users.read', {
    type: 'new_user_registered',
    title: 'New User Registered',
    message: `${input.fullName} (${input.email}) joined the site.`,
    data: { userId: input.userId, actorName: input.fullName },
  })
}

export async function emitRoleChanged(input: { userId: string; roleName: string }) {
  await notifyUser({
    userId: input.userId,
    type: 'role_changed',
    title: 'Role Changed',
    message: `Your role was updated to ${input.roleName}.`,
    data: { userId: input.userId },
    force: true,
  })
}

export async function emitNewLogin(input: {
  userId: string
  ip?: string | null
  userAgent?: string | null
}) {
  const location = input.ip ? `from ${input.ip}` : 'on a new device'
  await notifyUser({
    userId: input.userId,
    type: 'new_login',
    title: 'New Login',
    message: `Your account was accessed ${location}.`,
    data: { ip: input.ip, userAgent: input.userAgent },
    force: true,
  })
}

export async function emitPasswordChanged(userId: string) {
  await notifyUser({
    userId,
    type: 'password_changed',
    title: 'Password Changed',
    message: 'Your account password was updated successfully.',
    force: true,
  })
}

export async function emitTwoFactorEnabled(userId: string) {
  await notifyUser({
    userId,
    type: 'two_factor_enabled',
    title: 'Two-Factor Enabled',
    message: 'Two-factor authentication is now active on your account.',
    force: true,
  })
}

export async function emitFailedLoginAttempt(input: { userId: string; ip?: string | null }) {
  await notifyUser({
    userId: input.userId,
    type: 'failed_login',
    title: 'Failed Login Attempt',
    message: input.ip
      ? `Someone tried to sign in from ${input.ip}.`
      : 'Someone tried to sign in to your account.',
    data: { ip: input.ip },
    force: true,
  })
}
