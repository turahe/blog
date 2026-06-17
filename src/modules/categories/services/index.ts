import { cache } from 'react'
import { categoryRepository } from '../repositories'
import type { ListQueryParams } from '@/lib/crud/types'

export const listCategories = cache(async (params: ListQueryParams) => {
  return categoryRepository.findMany(params)
})

export const getCategoryById = cache(async (id: string) => {
  return categoryRepository.findById(id)
})
