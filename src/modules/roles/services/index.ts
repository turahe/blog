import { cache } from 'react'
import { roleRepository } from '../repositories'
import type { ListQueryParams } from '@/lib/crud/types'

export const listRoles = cache(async (params: ListQueryParams) => {
  return roleRepository.findMany(params)
})

export const getRoleById = cache(async (id: string) => {
  return roleRepository.findById(id)
})

export const getAllRoles = cache(async () => {
  return roleRepository.findAll()
})
