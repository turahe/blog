import { cache } from 'react'
import prisma from '@/lib/db/prisma'
import { mediaFolderRepository, mediaRepository } from '../repositories'
import type { ListQueryParams } from '@/lib/crud/types'
import type { MediaFolderItem, MediaListFilters } from '../types'

export const listMedia = cache(async (params: ListQueryParams & { filters?: MediaListFilters }) => {
  return mediaRepository.findMany(params)
})

export const getMediaById = cache(async (id: string) => mediaRepository.findById(id))

export async function listFoldersWithPaths(): Promise<MediaFolderItem[]> {
  const folders = await prisma.mediaFolder.findMany({
    include: { _count: { select: { children: true, media: true } } },
    orderBy: { name: 'asc' },
  })
  const byId = new Map(folders.map((f) => [f.id, f]))

  function pathFor(id: string): string {
    const parts: string[] = []
    let cur = byId.get(id)
    while (cur) {
      parts.unshift(cur.slug)
      cur = cur.parentId ? byId.get(cur.parentId) : undefined
    }
    return `media/${parts.join('/')}`
  }

  return folders.map((f) => ({
    id: f.id,
    name: f.name,
    slug: f.slug,
    parentId: f.parentId,
    path: pathFor(f.id),
    childCount: f._count.children,
    mediaCount: f._count.media,
  }))
}

export async function listUploadAuthors() {
  return prisma.user.findMany({
    where: { media: { some: {} } },
    select: { id: true, fullName: true },
    orderBy: { fullName: 'asc' },
  })
}

export { mediaFolderRepository }
