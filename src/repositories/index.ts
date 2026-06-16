import prisma from '@/lib/db/prisma'
import type { Post, Author, Tag, Project, Experience } from '@prisma/client'
import type { PostCore, PostWithBody, AuthorCore, AuthorWithBody } from '@/types/post'

type PostWithRelations = Post & {
  tags: { tag: Tag }[]
  authors: { author: Author }[]
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

function mapPostCore(post: PostWithRelations): PostCore {
  return {
    slug: post.slug,
    path: post.path,
    title: post.title,
    date: post.date.toISOString(),
    lastmod: post.lastmod?.toISOString(),
    draft: post.draft,
    summary: post.summary ?? undefined,
    tags: post.tags.map((pt) => pt.tag.name),
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

function mapAuthorCore(author: Author): AuthorCore {
  return {
    slug: author.slug,
    name: author.name,
    avatar: author.avatar ?? undefined,
    occupation: author.occupation ?? undefined,
    company: author.company ?? undefined,
    email: author.email ?? undefined,
    twitter: author.twitter ?? undefined,
    bluesky: author.bluesky ?? undefined,
    linkedin: author.linkedin ?? undefined,
    github: author.github ?? undefined,
    layout: author.layout ?? undefined,
  }
}

const postInclude = {
  tags: { include: { tag: true } },
  authors: { include: { author: true } },
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

export const authorRepository = {
  async findBySlug(slug: string): Promise<AuthorWithBody | null> {
    const author = await prisma.author.findUnique({ where: { slug } })
    if (!author) return null
    return { ...mapAuthorCore(author), body: author.body }
  },
}

export const projectRepository = {
  async findAll(): Promise<Project[]> {
    return prisma.project.findMany({ orderBy: { sortOrder: 'asc' } })
  },
}

export const experienceRepository = {
  async findAll(): Promise<Experience[]> {
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
