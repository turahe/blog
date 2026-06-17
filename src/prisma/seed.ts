import { createHash } from 'crypto'
import type { Prisma } from '@/lib/db/prisma'
import prisma from '@/lib/db/prisma'
import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { slug as slugify } from 'github-slugger'
import { extractToc } from '../lib/mdx/toc'
import projectsData from '../data/projectsData'
import experienceData from '../data/experienceData'
import { hashPassword } from '../lib/auth/password'
import { PERMISSIONS, ROLES } from '../lib/rbac/permissions-list'
import { SETTINGS_DEFAULTS } from '../modules/settings/config/defaults'

const blogDir = path.join(process.cwd(), 'src/data/blog')
const authorsDir = path.join(process.cwd(), 'src/data/authors')

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
  return { data, content }
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

async function seedAuthorProfiles() {
  const files = await fs.readdir(authorsDir)
  const placeholderHash = await hashPassword(authorPlaceholderPassword())

  for (const file of files) {
    if (!file.endsWith('.mdx')) continue
    const raw = await fs.readFile(path.join(authorsDir, file), 'utf-8')
    const { data, content } = parseMdxFile(raw)
    const authorSlug = file.replace(/\.mdx$/, '')
    const email = (data.email as string) || `${authorSlug}@authors.local`

    const existing = await prisma.user.findFirst({
      where: { OR: [{ slug: authorSlug }, { email }] },
    })

    const profile = {
      slug: authorSlug,
      fullName: data.name as string,
      avatar: (data.avatar as string) || null,
      occupation: (data.occupation as string) || null,
      company: (data.company as string) || null,
      twitter: (data.twitter as string) || null,
      bluesky: (data.bluesky as string) || null,
      linkedin: (data.linkedin as string) || null,
      github: (data.github as string) || null,
      bio: content,
      layout: (data.layout as string) || null,
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

async function seedPosts() {
  const files = await fs.readdir(blogDir)
  const defaultAuthor = await prisma.user.findFirst({ where: { slug: 'default' } })

  for (const file of files) {
    if (!file.endsWith('.mdx')) continue
    const raw = await fs.readFile(path.join(blogDir, file), 'utf-8')
    const { data, content } = parseMdxFile(raw)
    const postSlug = file.replace(/\.mdx$/, '')
    const rt = readingTime(content)
    const tags: string[] = data.tags || []

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
        images: data.images ?? null,
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
        images: data.images ?? null,
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

async function seedProjects() {
  await prisma.project.deleteMany()
  for (let i = 0; i < projectsData.length; i++) {
    const p = projectsData[i]
    await prisma.project.create({
      data: {
        title: p.title,
        description: p.description,
        imgSrc: p.imgSrc,
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
}

async function main() {
  console.log('Seeding author profiles (users)...')
  await seedAuthorProfiles()
  console.log('Seeding posts...')
  await seedPosts()
  console.log('Seeding projects...')
  await seedProjects()
  console.log('Seeding experience...')
  await seedExperience()
  console.log('Seeding auth & RBAC...')
  await seedAuth()
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
