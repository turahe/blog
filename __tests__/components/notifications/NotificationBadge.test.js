const React = require('react')
const { render, screen } = require('@testing-library/react')
const { NotificationBadge } = require('@/components/notifications/NotificationBadge')

describe('NotificationBadge', () => {
  test('renders nothing when count is zero', () => {
    const { container } = render(React.createElement(NotificationBadge, { count: 0 }))
    expect(container).toBeEmptyDOMElement()
  })

  test('renders count up to nine', () => {
    render(React.createElement(NotificationBadge, { count: 3 }))
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  test('caps display at 9+', () => {
    render(React.createElement(NotificationBadge, { count: 12 }))
    expect(screen.getByText('9+')).toBeInTheDocument()
  })
})
