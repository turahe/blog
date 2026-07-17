import { cache } from 'react'
import type { ListQueryParams } from '@/lib/crud/types'
import { projectRepository } from '../repositories'

export const listProjects = cache(async (params: ListQueryParams) => {
  return projectRepository.findMany(params)
})

export const getProjectById = cache(async (id: string) => {
  return projectRepository.findById(id)
})
