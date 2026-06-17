import { cache } from 'react'
import { tagAdminRepository } from '../repositories'
import type { ListQueryParams } from '@/lib/crud/types'

export const listTags = cache(async (params: ListQueryParams) => {
  return tagAdminRepository.findMany(params)
})

export const getTagById = cache(async (id: string) => {
  return tagAdminRepository.findById(id)
})
