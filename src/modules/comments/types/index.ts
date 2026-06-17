export type CommentStatus = 'PENDING' | 'APPROVED' | 'SPAM' | 'TRASH'

export type CommentAuthor = {
  name: string
  email?: string | null
  avatar?: string | null
  userId?: string | null
}

export type CommentItem = {
  id: string
  postId: string
  postSlug: string
  postTitle: string
  parentId: string | null
  content: string
  status: CommentStatus
  author: CommentAuthor
  createdAt: string
  replies: CommentItem[]
}

export type CommentSettings = {
  enabled: boolean
  requireApproval: boolean
  guestEnabled: boolean
  limitPerPost: number
}

export type CommentListItem = {
  id: string
  postId: string
  postSlug: string
  postTitle: string
  authorName: string
  authorEmail: string | null
  content: string
  status: CommentStatus
  createdAt: string
}
