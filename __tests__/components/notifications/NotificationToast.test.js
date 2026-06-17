const React = require('react')
const { render, screen } = require('@testing-library/react')
const userEvent = require('@testing-library/user-event').default
const { NotificationToast } = require('@/components/notifications/NotificationToast')

const baseItem = {
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
}

describe('NotificationToast', () => {
  test('renders notification content', () => {
    render(
      React.createElement(NotificationToast, {
        item: baseItem,
        onDismiss: jest.fn(),
        onView: jest.fn(),
      })
    )

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('Post published')).toBeInTheDocument()
    expect(screen.getByText('Your article is live.')).toBeInTheDocument()
  })

  test('uses link for view when href is set', async () => {
    const onView = jest.fn((event) => event.preventDefault())
    render(
      React.createElement(NotificationToast, {
        item: baseItem,
        onDismiss: jest.fn(),
        onView,
      })
    )

    const viewLink = screen.getByRole('link', { name: 'View' })
    viewLink.addEventListener('click', (event) => event.preventDefault())
    await userEvent.click(viewLink)
    expect(onView).toHaveBeenCalledTimes(1)
  })

  test('uses button for view when href is missing', async () => {
    const onView = jest.fn()
    render(
      React.createElement(NotificationToast, {
        item: { ...baseItem, href: null },
        onDismiss: jest.fn(),
        onView,
      })
    )

    await userEvent.click(screen.getByRole('button', { name: 'View' }))
    expect(onView).toHaveBeenCalledTimes(1)
  })

  test('calls onDismiss from dismiss controls', async () => {
    const onDismiss = jest.fn()
    render(
      React.createElement(NotificationToast, {
        item: baseItem,
        onDismiss,
        onView: jest.fn(),
      })
    )

    const dismissButtons = screen.getAllByRole('button', { name: 'Dismiss' })
    expect(dismissButtons).toHaveLength(2)

    await userEvent.click(dismissButtons[0])
    await userEvent.click(dismissButtons[1])
    expect(onDismiss).toHaveBeenCalledTimes(2)
  })
})
