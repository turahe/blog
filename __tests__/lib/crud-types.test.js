const { parseListQuery, paginate } = require('@/lib/crud/types')

describe('crud types', () => {
  test('parseListQuery applies defaults and clamps page size', () => {
    expect(parseListQuery({ page: 0, pageSize: 500 })).toEqual({
      page: 1,
      pageSize: 100,
      search: undefined,
      sortBy: undefined,
      sortOrder: 'desc',
      filters: undefined,
    })
  })

  test('paginate computes total pages', () => {
    expect(paginate(['a', 'b'], 25, 2, 10)).toEqual({
      data: ['a', 'b'],
      total: 25,
      page: 2,
      pageSize: 10,
      totalPages: 3,
    })
  })
})
