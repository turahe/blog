import { cache } from 'react'
import { postAdminRepository } from '../repositories'
import type { ListQueryParams } from '@/lib/crud/types'
import prisma from '@/lib/db/prisma'

export const listPosts = cache(async (params: ListQueryParams) => {
  return postAdminRepository.findMany(params)
})

export const getPostById = cache(async (id: string) => {
  return postAdminRepository.findById(id)
})

export const getAuthorOptions = cache(async () => {
  return prisma.user.findMany({
    where: { deletedAt: null, slug: { not: null } },
    select: { id: true, fullName: true, slug: true },
    orderBy: { fullName: 'asc' },
  })
})

export const getTagOptions = cache(async () => {
  return prisma.tag.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: 'asc' },
  })
})

export const getCategoryOptions = cache(async () => {
  return prisma.category.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: 'asc' },
  })
})
