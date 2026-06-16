import { PrismaClient, Prisma } from '@prisma/client'
import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { slug as slugify } from 'github-slugger'
import { extractToc } from '../lib/mdx/toc'
import projectsData from '../data/projectsData'
import experienceData from '../data/experienceData'

const prisma = new PrismaClient()

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

async function seedAuthors() {
  const files = await fs.readdir(authorsDir)
  for (const file of files) {
    if (!file.endsWith('.mdx')) continue
    const raw = await fs.readFile(path.join(authorsDir, file), 'utf-8')
    const { data, content } = parseMdxFile(raw)
    const authorSlug = file.replace(/\.mdx$/, '')

    await prisma.author.upsert({
      where: { slug: authorSlug },
      create: {
        slug: authorSlug,
        name: data.name,
        avatar: data.avatar,
        occupation: data.occupation,
        company: data.company,
        email: data.email,
        twitter: data.twitter,
        bluesky: data.bluesky,
        linkedin: data.linkedin,
        github: data.github,
        body: content,
        layout: data.layout,
      },
      update: {
        name: data.name,
        avatar: data.avatar,
        occupation: data.occupation,
        company: data.company,
        email: data.email,
        twitter: data.twitter,
        bluesky: data.bluesky,
        linkedin: data.linkedin,
        github: data.github,
        body: content,
        layout: data.layout,
      },
    })
  }
}

async function seedPosts() {
  const files = await fs.readdir(blogDir)
  const defaultAuthor = await prisma.author.findUnique({ where: { slug: 'default' } })

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
      const author = await prisma.author.findUnique({ where: { slug: authorSlug } })
      if (author) {
        await prisma.postAuthor.create({
          data: { postId: post.id, authorId: author.id },
        })
      } else if (defaultAuthor) {
        await prisma.postAuthor.create({
          data: { postId: post.id, authorId: defaultAuthor.id },
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

async function main() {
  console.log('Seeding authors...')
  await seedAuthors()
  console.log('Seeding posts...')
  await seedPosts()
  console.log('Seeding projects...')
  await seedProjects()
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
