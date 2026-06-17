export interface ListQueryParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filters?: Record<string, string>
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface CrudActionResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export function parseListQuery(
  params: ListQueryParams,
  defaults: { pageSize?: number; sortBy?: string } = {}
): Required<Pick<ListQueryParams, 'page' | 'pageSize' | 'sortOrder'>> &
  Pick<ListQueryParams, 'search' | 'sortBy' | 'filters'> {
  const page = Math.max(1, params.page ?? 1)
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? defaults.pageSize ?? 20))
  const sortOrder = params.sortOrder === 'asc' ? 'asc' : 'desc'
  return {
    page,
    pageSize,
    search: params.search?.trim() || undefined,
    sortBy: params.sortBy ?? defaults.sortBy,
    sortOrder,
    filters: params.filters,
  }
}

export function paginate<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number
): PaginatedResult<T> {
  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize) || 1,
  }
}
