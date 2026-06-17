const React = require('react')
const { render, screen } = require('@testing-library/react')
const userEvent = require('@testing-library/user-event').default
const { NotificationItem } = require('@/components/notifications/NotificationItem')

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
  createdAt: new Date().toISOString(),
}

describe('NotificationItem', () => {
  test('renders as link when href is set', () => {
    render(React.createElement(NotificationItem, { item: baseItem }))
    const link = screen.getByRole('link', { name: /Post published/i })
    expect(link).toHaveAttribute('href', '/admin/posts/my-post')
    expect(screen.getByText('Your article is live.')).toBeInTheDocument()
  })

  test('renders as button without href', () => {
    render(
      React.createElement(NotificationItem, {
        item: { ...baseItem, href: null },
      })
    )
    expect(screen.getByRole('button', { name: /Post published/i })).toBeInTheDocument()
  })

  test('calls onRead and onNavigate when activated', async () => {
    const onRead = jest.fn()
    const onNavigate = jest.fn()
    render(React.createElement(NotificationItem, { item: baseItem, onRead, onNavigate }))
    await userEvent.click(screen.getByRole('link', { name: /Post published/i }))
    expect(onRead).toHaveBeenCalledWith('n1')
    expect(onNavigate).toHaveBeenCalled()
  })
})
