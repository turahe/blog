import { cache } from 'react'
import type { ListQueryParams } from '@/lib/crud/types'
import { tagAdminRepository } from '../repositories'

export const listTags = cache(async (params: ListQueryParams) => {
  return tagAdminRepository.findMany(params)
})

export const getTagById = cache(async (id: string) => {
  return tagAdminRepository.findById(id)
})
