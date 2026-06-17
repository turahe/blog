import prisma from '@/lib/db/prisma'
import type { Prisma, Post, User, Tag, Category } from '@/lib/db/prisma'
import type { PostCore, PostWithBody, AuthorCore, AuthorWithBody, CategoryItem } from '@/types/post'

type PostWithRelations = Post & {
  tags: { tag: Tag }[]
  authors: { user: User }[]
  category: Category | null
}

function toReadingTime(minutes: number | null | undefined) {
  const m = minutes ?? 1
  return {
    text: `${m} min read`,
    minutes: m,
    time: m * 60 * 1000,
    words: 0,
  }
}

function mapUserToAuthorCore(user: User): AuthorCore {
  return {
    slug: user.slug ?? user.id,
    name: user.fullName,
    avatar: user.avatar ?? undefined,
    occupation: user.occupation ?? undefined,
    company: user.company ?? undefined,
    email: user.email,
    twitter: user.twitter ?? undefined,
    bluesky: user.bluesky ?? undefined,
    linkedin: user.linkedin ?? undefined,
    github: user.github ?? undefined,
    layout: user.layout ?? undefined,
  }
}

function mapPostCore(post: PostWithRelations): PostCore {
  const primaryAuthor = post.authors[0]?.user
  return {
    slug: post.slug,
    path: post.path,
    title: post.title,
    date: post.date.toISOString(),
    lastmod: post.lastmod?.toISOString(),
    draft: post.draft,
    summary: post.summary ?? undefined,
    tags: post.tags.map((pt) => pt.tag.name),
    category: post.category?.name,
    categorySlug: post.category?.slug,
    authorName: primaryAuthor?.fullName,
    authorSlug: primaryAuthor?.slug ?? undefined,
    layout: post.layout ?? undefined,
    music: post.music ?? undefined,
    images: post.images as string | string[] | undefined,
    readingTime: toReadingTime(post.readingTimeMinutes),
    wordCount: post.wordCount ?? undefined,
    bibliography: post.bibliography ?? undefined,
    canonicalUrl: post.canonicalUrl ?? undefined,
  }
}

function mapPostWithBody(post: PostWithRelations): PostWithBody {
  return {
    ...mapPostCore(post),
    body: post.body,
    toc: (post.toc as unknown as PostWithBody['toc']) ?? [],
    filePath: post.filePath ?? undefined,
  }
}

const postInclude = {
  tags: { include: { tag: true } },
  authors: { include: { user: true } },
  category: true,
} as const

export const postRepository = {
  async findAllPublished(): Promise<PostCore[]> {
    const posts = await prisma.post.findMany({
      where: { draft: false },
      include: postInclude,
      orderBy: { date: 'desc' },
    })
    return posts.map(mapPostCore)
  },

  async findAllIncludingDrafts(): Promise<PostCore[]> {
    const posts = await prisma.post.findMany({
      include: postInclude,
      orderBy: { date: 'desc' },
    })
    return posts.map(mapPostCore)
  },

  async findBySlug(slug: string): Promise<PostWithBody | null> {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: postInclude,
    })
    if (!post) return null
    if (post.draft && process.env.NODE_ENV === 'production') return null
    return mapPostWithBody(post)
  },

  async findAuthorsByPostSlug(slug: string): Promise<AuthorCore[]> {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: { authors: { include: { user: true } } },
    })
    if (!post) return []
    return post.authors.map((pa) => mapUserToAuthorCore(pa.user))
  },

  async findByTagSlug(tagSlug: string): Promise<PostCore[]> {
    const posts = await prisma.post.findMany({
      where: {
        draft: false,
        tags: { some: { tag: { slug: tagSlug } } },
      },
      include: postInclude,
      orderBy: { date: 'desc' },
    })
    return posts.map(mapPostCore)
  },

  async findByCategorySlug(categorySlug: string): Promise<PostCore[]> {
    const posts = await prisma.post.findMany({
      where: {
        draft: false,
        category: { slug: categorySlug },
      },
      include: postInclude,
      orderBy: { date: 'desc' },
    })
    return posts.map(mapPostCore)
  },

  async findByAuthorSlug(authorSlug: string): Promise<PostCore[]> {
    const posts = await prisma.post.findMany({
      where: {
        draft: false,
        authors: { some: { user: { slug: authorSlug } } },
      },
      include: postInclude,
      orderBy: { date: 'desc' },
    })
    return posts.map(mapPostCore)
  },

  async searchPublished(query: string, limit = 50): Promise<PostCore[]> {
    const q = query.trim()
    if (!q) return []
    const posts = await prisma.post.findMany({
      where: {
        draft: false,
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { summary: { contains: q, mode: 'insensitive' } },
          { body: { contains: q, mode: 'insensitive' } },
        ],
      },
      include: postInclude,
      orderBy: { date: 'desc' },
      take: limit,
    })
    return posts.map(mapPostCore)
  },

  async findRelated(slug: string, limit = 4): Promise<PostCore[]> {
    const current = await prisma.post.findUnique({
      where: { slug },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    })
    if (!current) return []

    const tagIds = current.tags.map((t) => t.tagId)
    const orClauses = [
      current.categoryId ? { categoryId: current.categoryId } : null,
      tagIds.length > 0 ? { tags: { some: { tagId: { in: tagIds } } } } : null,
    ].filter((c): c is NonNullable<typeof c> => c !== null)

    const posts = await prisma.post.findMany({
      where: {
        draft: false,
        slug: { not: slug },
        ...(orClauses.length > 0 ? { OR: orClauses } : {}),
      },
      include: postInclude,
      orderBy: { date: 'desc' },
      take: limit,
    })
    return posts.map(mapPostCore)
  },
}

export const tagRepository = {
  async getCounts(): Promise<Record<string, number>> {
    const tags = await prisma.tag.findMany({
      include: { _count: { select: { posts: true } } },
    })
    const counts: Record<string, number> = {}
    for (const tag of tags) {
      if (tag._count.posts > 0) {
        counts[tag.slug] = tag._count.posts
      }
    }
    return counts
  },
}

export const categoryRepository = {
  async findBySlug(slug: string) {
    return prisma.category.findUnique({ where: { slug } })
  },

  async findAllWithCounts(): Promise<CategoryItem[]> {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { posts: { where: { draft: false } } } } },
      orderBy: { name: 'asc' },
    })
    return categories
      .filter((c) => c._count.posts > 0)
      .map((c) => ({
        slug: c.slug,
        name: c.name,
        description: c.description ?? undefined,
        postCount: c._count.posts,
      }))
  },
}

export const authorRepository = {
  async findBySlug(slug: string): Promise<AuthorWithBody | null> {
    const user = await prisma.user.findFirst({
      where: { slug, deletedAt: null },
    })
    if (!user) return null
    return { ...mapUserToAuthorCore(user), body: user.bio ?? '' }
  },

  async findAllWithPosts(): Promise<AuthorCore[]> {
    const users = await prisma.user.findMany({
      where: {
        deletedAt: null,
        postAuthors: { some: { post: { draft: false } } },
      },
      distinct: ['id'],
    })
    return users.map(mapUserToAuthorCore)
  },
}

export const projectRepository = {
  async findAll(): Promise<Prisma.ProjectGetPayload<object>[]> {
    return prisma.project.findMany({ orderBy: { sortOrder: 'asc' } })
  },
}

export const experienceRepository = {
  async findAll() {
    return prisma.experience.findMany({ orderBy: { sortOrder: 'asc' } })
  },
}

export const githubCacheRepository = {
  async get(): Promise<{ data: unknown; fetchedAt: Date } | null> {
    return prisma.gitHubRepoCache.findUnique({ where: { id: 'default' } })
  },

  async set(data: unknown): Promise<void> {
    await prisma.gitHubRepoCache.deleteMany({ where: { id: 'default' } })
    await prisma.gitHubRepoCache.create({
      data: { id: 'default', data: data as object, fetchedAt: new Date() },
    })
  },
}
