const React = require('react')
const { render, screen, waitFor } = require('@testing-library/react')
const userEvent = require('@testing-library/user-event').default
const {
  fetchNotificationsAction,
  markNotificationReadAction,
  deleteNotificationAction,
} = require('@/modules/notifications/actions')

const mockMarkAllRead = jest.fn()

jest.mock('@/modules/notifications/actions', () => ({
  fetchNotificationsAction: jest.fn(),
  markNotificationReadAction: jest.fn(),
  deleteNotificationAction: jest.fn(),
}))

jest.mock('@/components/notifications/NotificationProvider', () => ({
  useNotifications: () => ({
    unreadCount: 2,
    markAllRead: mockMarkAllRead,
  }),
}))

const { NotificationCenter } = require('@/components/notifications/NotificationCenter')

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

describe('NotificationCenter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    fetchNotificationsAction.mockResolvedValue({
      success: true,
      data: {
        items: [makeItem(), makeItem({ id: 'n2', title: 'New comment', read: true })],
        nextCursor: null,
        unreadCount: 1,
      },
    })
    markNotificationReadAction.mockResolvedValue({ success: true })
    deleteNotificationAction.mockResolvedValue({ success: true })
  })

  test('loads and renders notifications', async () => {
    render(React.createElement(NotificationCenter))

    await waitFor(() => {
      expect(screen.getByText('Post published')).toBeInTheDocument()
    })

    expect(screen.getByRole('heading', { name: 'Notifications' })).toBeInTheDocument()
    expect(screen.getByText('2 unread notifications')).toBeInTheDocument()
    expect(screen.getByText('New comment')).toBeInTheDocument()
  })

  test('shows empty state when no notifications match', async () => {
    fetchNotificationsAction.mockResolvedValue({
      success: true,
      data: { items: [], nextCursor: null, unreadCount: 0 },
    })

    render(React.createElement(NotificationCenter))

    await waitFor(() => {
      expect(screen.getByText('No notifications match your filters.')).toBeInTheDocument()
    })
  })

  test('marks all notifications as read', async () => {
    render(React.createElement(NotificationCenter))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Mark all as read' })).toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole('button', { name: 'Mark all as read' }))
    expect(mockMarkAllRead).toHaveBeenCalled()
  })

  test('deletes a notification', async () => {
    render(React.createElement(NotificationCenter))

    await waitFor(() => {
      expect(screen.getByText('Post published')).toBeInTheDocument()
    })

    await userEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0])

    await waitFor(() => {
      expect(deleteNotificationAction).toHaveBeenCalledWith('n1')
      expect(screen.queryByText('Post published')).not.toBeInTheDocument()
    })
  })
})
