import { cache } from 'react'
import type { ListQueryParams } from '@/lib/crud/types'
import { userRepository } from '../repositories'

export const listUsers = cache(async (params: ListQueryParams) => {
  return userRepository.findMany(params)
})

export const getUserById = cache(async (id: string) => {
  return userRepository.findById(id)
})

export const getActiveUserCount = cache(async () => {
  return userRepository.countActive()
})

export const getTotalUserCount = cache(async () => {
  const { total } = await userRepository.findMany({ page: 1, pageSize: 1 })
  return total
})
