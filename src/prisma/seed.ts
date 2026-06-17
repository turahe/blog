import { createHash } from 'crypto'
import type { Prisma } from '@/lib/db/prisma'
import prisma from '@/lib/db/prisma'
import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { slugify } from '../lib/slug'
import { extractToc } from '../lib/mdx/toc'
import projectsData from '../data/projectsData'
import experienceData from '../data/experienceData'
import { hashPassword } from '../lib/auth/password'
import { PERMISSIONS, ROLES } from '../lib/rbac/permissions-list'
import { SETTINGS_DEFAULTS } from '../modules/settings/config/defaults'
import { uploadBufferToMinio } from '../lib/storage/minio'
import { getExtension } from '../modules/media/constants'

const blogDir = path.join(process.cwd(), 'src/data/blog')
const authorsDir = path.join(process.cwd(), 'src/data/authors')
const publicDir = path.join(process.cwd(), 'public')

const MIME_BY_EXTENSION: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  avif: 'image/avif',
  svg: 'image/svg+xml',
}

type SeedImageRef = {
  path: string
  kind: 'post' | 'project'
  label: string
}

interface PostFrontmatter {
  title: string
  date: string
  lastmod?: string
  draft?: boolean
  summary?: string
  layout?: string
  music?: string
  bibliography?: string
  canonicalUrl?: string
  images?: string | string[]
  tags?: string[]
  authors?: string[]
}

interface AuthorFrontmatter {
  name: string
  email?: string
  avatar?: string
  occupation?: string
  company?: string
  twitter?: string
  bluesky?: string
  linkedin?: string
  github?: string
  layout?: string
}

function parseMdxFile(raw: string) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) {
    throw new Error('Invalid MDX frontmatter')
  }
  const frontmatter = match[1]
  const content = match[2]
  const fixedFrontmatter = frontmatter
    .split('\n')
    .map((line) => {
      const idx = line.indexOf(':')
      if (idx === -1) return line
      const key = line.slice(0, idx)
      const value = line.slice(idx + 1).trim()
      if (!value || value.startsWith("'") || value.startsWith('"') || value.startsWith('[')) {
        return line
      }
      if (value.includes(':')) {
        return `${key}: "${value.replace(/"/g, '\\"')}"`
      }
      return line
    })
    .join('\n')
  const { data } = matter(`---\n${fixedFrontmatter}\n---\n`)
  return { data: data as unknown as PostFrontmatter, content }
}

function computeWordCount(text: string): number {
  const cleaned = text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#*_~`]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
  return cleaned.split(/\s+/).filter((word) => word.length > 0).length
}

async function getToc(content: string) {
  return extractToc(content)
}

function authorPlaceholderPassword() {
  return createHash('sha256').update('author-profile-no-login').digest('hex')
}

function guessMimeType(filename: string) {
  const extension = getExtension(filename)
  return MIME_BY_EXTENSION[extension] ?? 'application/octet-stream'
}

function normalizeImagePaths(images: unknown): string[] {
  if (!images) return []
  if (typeof images === 'string') {
    const trimmed = images.trim()
    return trimmed ? [trimmed] : []
  }
  if (!Array.isArray(images)) return []
  return images.filter(
    (value): value is string => typeof value === 'string' && value.trim().length > 0
  )
}

function toSeedObjectKey(staticPath: string) {
  return `seed${staticPath}`
}

function resolveImageUrl(staticPath: string, urlMap: Map<string, string>) {
  return urlMap.get(staticPath) ?? staticPath
}

function resolveImageList(images: unknown, urlMap: Map<string, string>) {
  const paths = normalizeImagePaths(images)
  if (!paths.length) return null
  return paths.map((imagePath) => resolveImageUrl(imagePath, urlMap))
}

async function collectSeedImages(): Promise<SeedImageRef[]> {
  const seen = new Set<string>()
  const images: SeedImageRef[] = []

  const addImage = (imagePath: string, kind: SeedImageRef['kind'], label: string) => {
    if (!imagePath.startsWith('/static/images/') || seen.has(imagePath)) return
    seen.add(imagePath)
    images.push({ path: imagePath, kind, label })
  }

  for (const project of projectsData) {
    addImage(project.imgSrc, 'project', project.title)
  }

  const blogFiles = await fs.readdir(blogDir)
  for (const file of blogFiles) {
    if (!file.endsWith('.mdx')) continue
    const raw = await fs.readFile(path.join(blogDir, file), 'utf-8')
    const { data } = parseMdxFile(raw)
    const postSlug = file.replace(/\.mdx$/, '')
    for (const imagePath of normalizeImagePaths(data.images)) {
      addImage(imagePath, 'post', data.title || postSlug)
    }
  }

  return images
}

async function upsertRootMediaFolder(name: string) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const existing = await prisma.mediaFolder.findFirst({
    where: { slug, parentId: null },
  })
  if (existing) return existing
  return prisma.mediaFolder.create({ data: { name, slug } })
}

async function seedMedia(uploadedById?: string) {
  const images = await collectSeedImages()
  if (!images.length) {
    console.log('No seed images found for posts or projects.')
    return new Map<string, string>()
  }

  const postsFolder = await upsertRootMediaFolder('Posts')
  const projectsFolder = await upsertRootMediaFolder('Projects')
  const urlMap = new Map<string, string>()

  for (const image of images) {
    const filename = path.basename(image.path)
    const absPath = path.join(publicDir, image.path.replace(/^\//, ''))
    const folder = image.kind === 'project' ? projectsFolder : postsFolder
    const folderPath = image.kind === 'project' ? 'seed/projects' : 'seed/posts'
    const objectKey = toSeedObjectKey(image.path)

    let buffer: Buffer | null = null
    try {
      buffer = await fs.readFile(absPath)
    } catch {
      console.warn(`Seed image file missing: ${image.path}`)
    }

    let mediaUrl = image.path
    let mediaData: Prisma.MediaCreateInput = {
      key: objectKey,
      url: image.path,
      filename,
      originalName: filename,
      mimeType: guessMimeType(filename),
      extension: getExtension(filename),
      size: buffer?.length ?? 0,
      altText: image.label,
      title: image.label,
      folder: folderPath,
      folderRef: { connect: { id: folder.id } },
      uploadedBy: uploadedById ? { connect: { id: uploadedById } } : undefined,
    }

    if (buffer) {
      try {
        const uploaded = await uploadBufferToMinio(
          buffer,
          filename,
          guessMimeType(filename),
          objectKey
        )
        mediaUrl = uploaded.url
        mediaData = {
          ...mediaData,
          url: uploaded.url,
          mimeType: uploaded.mimeType,
          extension: uploaded.extension,
          size: uploaded.size,
          width: uploaded.width,
          height: uploaded.height,
          variants: uploaded.variants as Prisma.InputJsonValue,
        }
      } catch (error) {
        console.warn(`MinIO upload failed for ${image.path}; keeping static URL.`, error)
      }
    }

    await prisma.media.upsert({
      where: { key: objectKey },
      create: mediaData,
      update: {
        url: mediaData.url,
        filename: mediaData.filename,
        originalName: mediaData.originalName,
        mimeType: mediaData.mimeType,
        extension: mediaData.extension,
        size: mediaData.size,
        width: mediaData.width,
        height: mediaData.height,
        variants: mediaData.variants,
        altText: image.label,
        title: image.label,
        folder: folderPath,
        folderRef: { connect: { id: folder.id } },
        uploadedBy: uploadedById ? { connect: { id: uploadedById } } : undefined,
      },
    })

    urlMap.set(image.path, mediaUrl)
  }

  return urlMap
}

async function seedAuthorProfiles() {
  const files = await fs.readdir(authorsDir)
  const placeholderHash = await hashPassword(authorPlaceholderPassword())

  for (const file of files) {
    if (!file.endsWith('.mdx')) continue
    const raw = await fs.readFile(path.join(authorsDir, file), 'utf-8')
    const { data, content } = parseMdxFile(raw)
    const authorSlug = file.replace(/\.mdx$/, '')
    const authorData = data as unknown as AuthorFrontmatter
    const email = authorData.email || `${authorSlug}@authors.local`

    const existing = await prisma.user.findFirst({
      where: { OR: [{ slug: authorSlug }, { email }] },
    })

    const profile = {
      slug: authorSlug,
      fullName: authorData.name,
      avatar: authorData.avatar || null,
      occupation: authorData.occupation || null,
      company: authorData.company || null,
      twitter: authorData.twitter || null,
      bluesky: authorData.bluesky || null,
      linkedin: authorData.linkedin || null,
      github: authorData.github || null,
      bio: content,
      layout: authorData.layout || null,
    }

    if (existing) {
      await prisma.user.update({
        where: { id: existing.id },
        data: profile,
      })
    } else {
      await prisma.user.create({
        data: {
          email,
          passwordHash: placeholderHash,
          status: 'ACTIVE',
          ...profile,
        },
      })
    }
  }
}

async function seedPosts(urlMap: Map<string, string>) {
  const files = await fs.readdir(blogDir)
  const defaultAuthor = await prisma.user.findFirst({ where: { slug: 'default' } })

  for (const file of files) {
    if (!file.endsWith('.mdx')) continue
    const raw = await fs.readFile(path.join(blogDir, file), 'utf-8')
    const { data, content } = parseMdxFile(raw)
    const postSlug = file.replace(/\.mdx$/, '')
    const rt = readingTime(content)
    const tags = data.tags || []
    const images = resolveImageList(data.images, urlMap) as Prisma.InputJsonValue | undefined

    const post = await prisma.post.upsert({
      where: { slug: postSlug },
      create: {
        slug: postSlug,
        title: data.title,
        date: new Date(data.date),
        lastmod: data.lastmod ? new Date(data.lastmod) : null,
        draft: data.draft ?? false,
        summary: data.summary,
        body: content,
        layout: data.layout || 'PostLayout',
        music: data.music,
        bibliography: data.bibliography,
        canonicalUrl: data.canonicalUrl,
        images,
        readingTimeMinutes: rt.minutes,
        wordCount: computeWordCount(content),
        toc: (await getToc(content)) as unknown as Prisma.InputJsonValue,
        path: `blog/${postSlug}`,
        filePath: `data/blog/${file}`,
      },
      update: {
        title: data.title,
        date: new Date(data.date),
        lastmod: data.lastmod ? new Date(data.lastmod) : null,
        draft: data.draft ?? false,
        summary: data.summary,
        body: content,
        layout: data.layout || 'PostLayout',
        music: data.music,
        bibliography: data.bibliography,
        canonicalUrl: data.canonicalUrl,
        images,
        readingTimeMinutes: rt.minutes,
        wordCount: computeWordCount(content),
        toc: (await getToc(content)) as unknown as Prisma.InputJsonValue,
        path: `blog/${postSlug}`,
        filePath: `data/blog/${file}`,
      },
    })

    const authorSlugs: string[] = data.authors || ['default']
    await prisma.postAuthor.deleteMany({ where: { postId: post.id } })
    for (const authorSlug of authorSlugs) {
      const user = await prisma.user.findFirst({ where: { slug: authorSlug } })
      if (user) {
        await prisma.postAuthor.create({
          data: { postId: post.id, userId: user.id },
        })
      } else if (defaultAuthor) {
        await prisma.postAuthor.create({
          data: { postId: post.id, userId: defaultAuthor.id },
        })
      }
    }

    await prisma.postTag.deleteMany({ where: { postId: post.id } })
    for (const tagName of tags) {
      const tagSlug = slugify(tagName)
      const tag = await prisma.tag.upsert({
        where: { slug: tagSlug },
        create: { slug: tagSlug, name: tagName },
        update: { name: tagName },
      })
      await prisma.postTag.create({
        data: { postId: post.id, tagId: tag.id },
      })
    }
  }
}

async function seedProjects(urlMap: Map<string, string>) {
  await prisma.project.deleteMany()
  for (let i = 0; i < projectsData.length; i++) {
    const p = projectsData[i]
    await prisma.project.create({
      data: {
        title: p.title,
        description: p.description,
        imgSrc: resolveImageUrl(p.imgSrc, urlMap),
        href: p.href,
        sortOrder: i,
      },
    })
  }
}

async function seedExperience() {
  await prisma.experience.deleteMany()
  for (let i = 0; i < experienceData.length; i++) {
    const e = experienceData[i]
    await prisma.experience.create({
      data: {
        title: e.title,
        company: e.company,
        location: e.location,
        range: e.range,
        url: e.url,
        text: e.text,
        sortOrder: i,
      },
    })
  }
}

async function seedAuth() {
  console.log('Seeding permissions...')
  const permissionRecords = await Promise.all(
    PERMISSIONS.map((p) =>
      prisma.permission.upsert({
        where: { slug: p.slug },
        create: { slug: p.slug, name: p.name, group: p.group },
        update: { name: p.name, group: p.group },
      })
    )
  )

  console.log('Seeding roles...')
  const roleRecords = await Promise.all(
    ROLES.map((r) =>
      prisma.role.upsert({
        where: { slug: r.slug },
        create: { slug: r.slug, name: r.name, description: r.description },
        update: { name: r.name, description: r.description },
      })
    )
  )

  const superadminRole = roleRecords.find((r) => r.slug === 'superadmin')!
  const adminRole = roleRecords.find((r) => r.slug === 'admin')!
  const operatorRole = roleRecords.find((r) => r.slug === 'operator')!

  const allPermissionIds = permissionRecords.map((p) => p.id)
  const adminPermissionIds = permissionRecords
    .filter(
      (p) =>
        ![
          'users.delete',
          'roles.delete',
          'posts.delete',
          'projects.delete',
          'tags.delete',
          'categories.delete',
        ].includes(p.slug)
    )
    .map((p) => p.id)
  const operatorPermissionIds = permissionRecords
    .filter((p) =>
      [
        'dashboard.view',
        'users.view',
        'audit.view',
        'posts.view',
        'projects.view',
        'tags.view',
        'categories.view',
        'media.view',
      ].includes(p.slug)
    )
    .map((p) => p.id)

  for (const [role, permIds] of [
    [superadminRole, allPermissionIds],
    [adminRole, adminPermissionIds],
    [operatorRole, operatorPermissionIds],
  ] as const) {
    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } })
    if (permIds.length > 0) {
      await prisma.rolePermission.createMany({
        data: permIds.map((permissionId) => ({ roleId: role.id, permissionId })),
      })
    }
  }

  console.log('Seeding superadmin user...')
  const passwordHash = await hashPassword('ChangeMe123!')
  const superadmin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    create: {
      email: 'admin@example.com',
      passwordHash,
      fullName: 'Super Admin',
      status: 'ACTIVE',
    },
    update: { passwordHash, fullName: 'Super Admin', status: 'ACTIVE', deletedAt: null },
  })

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: superadmin.id, roleId: superadminRole.id } },
    create: { userId: superadmin.id, roleId: superadminRole.id },
    update: {},
  })

  console.log('Seeding default settings...')
  for (const s of SETTINGS_DEFAULTS) {
    await prisma.setting.upsert({
      where: { key: s.key },
      create: { key: s.key, value: s.value, type: s.type, group: s.group },
      update: { value: s.value, type: s.type, group: s.group },
    })
  }

  return superadmin.id
}

async function main() {
  console.log('Seeding author profiles (users)...')
  await seedAuthorProfiles()
  console.log('Seeding auth & RBAC...')
  const superadminId = await seedAuth()
  console.log('Seeding media...')
  const imageUrlMap = await seedMedia(superadminId)
  console.log('Seeding posts...')
  await seedPosts(imageUrlMap)
  console.log('Seeding projects...')
  await seedProjects(imageUrlMap)
  console.log('Seeding experience...')
  await seedExperience()
  console.log('Seed completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
