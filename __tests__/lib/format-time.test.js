const { formatNotificationTime } = require('@/lib/notifications/format-time')

describe('formatNotificationTime', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-06-16T12:00:00.000Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('returns relative minutes for recent timestamps', () => {
    const iso = new Date('2026-06-16T11:58:00.000Z').toISOString()
    expect(formatNotificationTime(iso)).toBe('2 minutes ago')
  })

  test('returns Just now for very recent timestamps', () => {
    const iso = new Date('2026-06-16T11:59:50.000Z').toISOString()
    expect(formatNotificationTime(iso)).toBe('Just now')
  })
})
