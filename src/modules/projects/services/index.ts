import { cache } from 'react'
import { projectRepository } from '../repositories'
import type { ListQueryParams } from '@/lib/crud/types'

export const listProjects = cache(async (params: ListQueryParams) => {
  return projectRepository.findMany(params)
})

export const getProjectById = cache(async (id: string) => {
  return projectRepository.findById(id)
})
