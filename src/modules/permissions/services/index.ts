import { cache } from 'react'
import { permissionRepository } from '../repositories'
import type { ListQueryParams } from '@/lib/crud/types'

export const listPermissions = cache(async (params: ListQueryParams) => {
  return permissionRepository.findMany(params)
})

export const getAllPermissions = cache(async () => {
  return permissionRepository.findAll()
})
