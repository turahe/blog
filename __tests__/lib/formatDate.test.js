const { formatDate, formatDateUtc } = require('@/lib/formatDate')

describe('formatDate', () => {
  test('formats ISO date in default locale', () => {
    const formatted = formatDate('2024-06-15')
    expect(formatted).toMatch(/2024/)
    expect(formatted).toMatch(/June|Juni|15/)
  })

  test('respects locale argument', () => {
    const formatted = formatDate('2024-12-01', 'id-ID')
    expect(formatted).toContain('2024')
  })
})

describe('formatDateUtc', () => {
  test('uses UTC timezone for calendar date', () => {
    const formatted = formatDateUtc('2024-01-15T23:30:00.000Z', 'en-US')
    expect(formatted).toMatch(/January 15, 2024/)
  })
})
