import prisma from '@/lib/db/prisma'

export async function getSeededPost() {
  const post = await prisma.post.findFirst({
    where: { draft: false },
    orderBy: { createdAt: 'asc' },
    select: { id: true, slug: true, title: true },
  })

  if (!post) {
    throw new Error('No published post found. Run: npx prisma db seed')
  }

  return post
}

export async function getAdminUser() {
  const user = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
    select: { id: true, email: true, fullName: true },
  })

  if (!user) {
    throw new Error('Admin user not found. Run: npx prisma db seed')
  }

  return user
}

export async function cleanupComments(ids: string[]) {
  if (ids.length === 0) return
  await prisma.comment.deleteMany({ where: { id: { in: ids } } })
}

export async function cleanupNotifications(ids: string[]) {
  if (ids.length === 0) return
  await prisma.notification.deleteMany({ where: { id: { in: ids } } })
}
