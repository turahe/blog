import { cache } from 'react'
import type { ListQueryParams } from '@/lib/crud/types'
import { categoryRepository } from '../repositories'

export const listCategories = cache(async (params: ListQueryParams) => {
  return categoryRepository.findMany(params)
})

export const getCategoryById = cache(async (id: string) => {
  return categoryRepository.findById(id)
})
