const React = require('react')
const { render, screen } = require('@testing-library/react')
const userEvent = require('@testing-library/user-event').default

const mockRefresh = jest.fn()
const mockMarkRead = jest.fn()
const mockMarkAllRead = jest.fn()

jest.mock('@/components/notifications/NotificationProvider', () => ({
  useNotifications: jest.fn(),
}))

const { useNotifications } = require('@/components/notifications/NotificationProvider')
const { NotificationDropdown } = require('@/components/notifications/NotificationDropdown')

function makeItem(overrides = {}) {
  return {
    id: 'n1',
    type: 'post_published',
    category: 'content',
    title: 'Post published',
    message: 'Your article is live.',
    data: null,
    href: '/admin/posts/my-post',
    read: false,
    readAt: null,
    createdAt: '2024-06-01T12:00:00.000Z',
    ...overrides,
  }
}

describe('NotificationDropdown', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    useNotifications.mockReturnValue({
      items: [makeItem(), makeItem({ id: 'n2', title: 'Comment approved', read: true })],
      unreadCount: 1,
      loading: false,
      markRead: mockMarkRead,
      markAllRead: mockMarkAllRead,
      refresh: mockRefresh,
    })
  })

  test('shows unread count in trigger label', () => {
    render(
      React.createElement(NotificationDropdown, {
        isOpen: false,
        onOpen: jest.fn(),
        onClose: jest.fn(),
      })
    )

    expect(screen.getByRole('button', { name: '1 unread notifications' })).toBeInTheDocument()
  })

  test('opens panel and refreshes notifications', async () => {
    const onOpen = jest.fn()
    render(
      React.createElement(NotificationDropdown, {
        isOpen: false,
        onOpen,
        onClose: jest.fn(),
      })
    )

    await userEvent.click(screen.getByRole('button', { name: '1 unread notifications' }))
    expect(onOpen).toHaveBeenCalled()
    expect(mockRefresh).toHaveBeenCalled()
  })

  test('renders notifications when open', () => {
    render(
      React.createElement(NotificationDropdown, {
        isOpen: true,
        onOpen: jest.fn(),
        onClose: jest.fn(),
      })
    )

    expect(screen.getByText('Notifications')).toBeInTheDocument()
    expect(screen.getByText('1 unread')).toBeInTheDocument()
    expect(screen.getByText('Post published')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'View all notifications' })).toHaveAttribute(
      'href',
      '/notifications'
    )
  })

  test('filters to unread tab', async () => {
    render(
      React.createElement(NotificationDropdown, {
        isOpen: true,
        onOpen: jest.fn(),
        onClose: jest.fn(),
      })
    )

    await userEvent.click(screen.getByRole('button', { name: 'unread' }))
    expect(screen.getByText('Post published')).toBeInTheDocument()
    expect(screen.queryByText('Comment approved')).not.toBeInTheDocument()
  })

  test('marks all as read', async () => {
    render(
      React.createElement(NotificationDropdown, {
        isOpen: true,
        onOpen: jest.fn(),
        onClose: jest.fn(),
      })
    )

    await userEvent.click(screen.getByRole('button', { name: 'Mark all read' }))
    expect(mockMarkAllRead).toHaveBeenCalled()
  })
})
