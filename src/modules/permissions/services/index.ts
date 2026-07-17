import { cache } from 'react'
import type { ListQueryParams } from '@/lib/crud/types'
import { permissionRepository } from '../repositories'

export const listPermissions = cache(async (params: ListQueryParams) => {
  return permissionRepository.findMany(params)
})

export const getAllPermissions = cache(async () => {
  return permissionRepository.findAll()
})
