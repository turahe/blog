import prisma from '@/lib/db/prisma'
import type { Prisma } from '@/lib/db/prisma'
import type { ListQueryParams, PaginatedResult } from '@/lib/crud/types'
import { parseListQuery, paginate } from '@/lib/crud/types'
import { MIME_FILTER_MAP } from '../constants'
import type { MediaItem, MediaListFilters, MediaVariants } from '../types'

function mapMediaRow(row: {
  id: string
  key: string
  url: string
  filename: string
  originalName: string | null
  mimeType: string
  extension: string | null
  size: number
  width: number | null
  height: number | null
  alt: string | null
  altText: string | null
  title: string | null
  caption: string | null
  description: string | null
  folder: string
  folderId: string | null
  variants: unknown
  createdAt: Date
  updatedAt: Date
  uploadedBy: { id: string; fullName: string } | null
  tags: { tag: { id: string; name: string; slug: string } }[]
}): MediaItem {
  return {
    id: row.id,
    key: row.key,
    url: row.url,
    filename: row.filename,
    originalName: row.originalName,
    mimeType: row.mimeType,
    extension: row.extension,
    size: row.size,
    width: row.width,
    height: row.height,
    altText: row.altText ?? row.alt,
    title: row.title,
    caption: row.caption,
    description: row.description,
    folderId: row.folderId,
    folderPath: row.folder,
    variants: (row.variants as MediaVariants | null) ?? null,
    uploadedBy: row.uploadedBy,
    tags: row.tags.map((t) => t.tag),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

const mediaInclude = {
  uploadedBy: { select: { id: true, fullName: true } },
  tags: { include: { tag: true } },
} satisfies Prisma.MediaInclude

function buildWhere(filters?: MediaListFilters, search?: string): Prisma.MediaWhereInput {
  const where: Prisma.MediaWhereInput = {}

  if (search) {
    where.OR = [
      { filename: { contains: search, mode: 'insensitive' } },
      { originalName: { contains: search, mode: 'insensitive' } },
      { altText: { contains: search, mode: 'insensitive' } },
      { caption: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { key: { contains: search, mode: 'insensitive' } },
      { tags: { some: { tag: { name: { contains: search, mode: 'insensitive' } } } } },
    ]
  }

  if (filters?.folderId) where.folderId = filters.folderId
  if (filters?.uploadedById) where.uploadedById = filters.uploadedById
  if (filters?.mimeType) where.mimeType = filters.mimeType
  if (filters?.type && filters.type !== 'all') {
    const mimes = MIME_FILTER_MAP[filters.type]
    if (mimes?.length) where.mimeType = { in: mimes }
  }
  if (filters?.dateFrom || filters?.dateTo) {
    where.createdAt = {}
    if (filters.dateFrom) where.createdAt.gte = new Date(filters.dateFrom)
    if (filters.dateTo) where.createdAt.lte = new Date(filters.dateTo)
  }

  return where
}

export const mediaRepository = {
  async findMany(
    params: ListQueryParams & { filters?: MediaListFilters }
  ): Promise<PaginatedResult<MediaItem>> {
    const q = parseListQuery(params, { sortBy: 'createdAt' })
    const where = buildWhere(params.filters, q.search)

    const orderBy: Prisma.MediaOrderByWithRelationInput =
      q.sortBy === 'filename'
        ? { filename: q.sortOrder }
        : q.sortBy === 'size'
          ? { size: q.sortOrder }
          : q.sortBy === 'mimeType'
            ? { mimeType: q.sortOrder }
            : { createdAt: q.sortOrder }

    const [rows, total] = await Promise.all([
      prisma.media.findMany({
        where,
        include: mediaInclude,
        orderBy,
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
      }),
      prisma.media.count({ where }),
    ])

    return paginate(rows.map(mapMediaRow), total, q.page, q.pageSize)
  },

  async findById(id: string) {
    const row = await prisma.media.findUnique({ where: { id }, include: mediaInclude })
    return row ? mapMediaRow(row) : null
  },

  async create(data: Prisma.MediaCreateInput) {
    const row = await prisma.media.create({ data, include: mediaInclude })
    return mapMediaRow(row)
  },

  async update(id: string, data: Prisma.MediaUpdateInput) {
    const row = await prisma.media.update({ where: { id }, data, include: mediaInclude })
    return mapMediaRow(row)
  },

  async delete(id: string) {
    return prisma.media.delete({ where: { id } })
  },

  async bulkDelete(ids: string[]) {
    return prisma.media.deleteMany({ where: { id: { in: ids } } })
  },

  async bulkUpdateFolder(ids: string[], folderId: string | null, folderPath: string) {
    return prisma.media.updateMany({
      where: { id: { in: ids } },
      data: { folderId, folder: folderPath },
    })
  },

  async setTags(mediaId: string, tagNames: string[]) {
    await prisma.mediaTagOnMedia.deleteMany({ where: { mediaId } })
    for (const name of tagNames) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      const tag = await prisma.mediaTag.upsert({
        where: { slug },
        create: { name, slug },
        update: { name },
      })
      await prisma.mediaTagOnMedia.create({ data: { mediaId, tagId: tag.id } })
    }
  },
}

export const mediaFolderRepository = {
  async findAll() {
    const folders = await prisma.mediaFolder.findMany({
      include: { _count: { select: { children: true, media: true } } },
      orderBy: { name: 'asc' },
    })
    return folders.map((f) => ({
      id: f.id,
      name: f.name,
      slug: f.slug,
      parentId: f.parentId,
      path: '',
      childCount: f._count.children,
      mediaCount: f._count.media,
    }))
  },

  async findById(id: string) {
    return prisma.mediaFolder.findUnique({ where: { id } })
  },

  async create(name: string, parentId: string | null) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    return prisma.mediaFolder.create({
      data: { name, slug, parent: parentId ? { connect: { id: parentId } } : undefined },
    })
  },

  async update(id: string, data: { name?: string; parentId?: string | null }) {
    const patch: Prisma.MediaFolderUpdateInput = {}
    if (data.name) {
      patch.name = data.name
      patch.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    }
    if (data.parentId !== undefined) {
      patch.parent = data.parentId ? { connect: { id: data.parentId } } : { disconnect: true }
    }
    return prisma.mediaFolder.update({ where: { id }, data: patch })
  },

  async delete(id: string) {
    return prisma.mediaFolder.delete({ where: { id } })
  },

  async getPath(folderId: string | null): Promise<{ id: string; name: string }[]> {
    if (!folderId) return []
    const trail: { id: string; name: string }[] = []
    let current = await prisma.mediaFolder.findUnique({ where: { id: folderId } })
    while (current) {
      trail.unshift({ id: current.id, name: current.name })
      current = current.parentId
        ? await prisma.mediaFolder.findUnique({ where: { id: current.parentId } })
        : null
    }
    return trail
  },

  async resolveStoragePath(folderId: string | null): Promise<string> {
    const trail = await this.getPath(folderId)
    if (!trail.length) return 'media'
    return `media/${trail.map((t) => t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).join('/')}`
  },
}
