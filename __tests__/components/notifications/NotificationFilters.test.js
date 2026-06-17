const React = require('react')
const { render, screen } = require('@testing-library/react')
const userEvent = require('@testing-library/user-event').default
const { NotificationFilters } = require('@/components/notifications/NotificationFilters')

describe('NotificationFilters', () => {
  const handlers = {
    onCategoryChange: jest.fn(),
    onStatusChange: jest.fn(),
    onRangeChange: jest.fn(),
    onSearchChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders current filter values', () => {
    render(
      React.createElement(NotificationFilters, {
        category: 'security',
        status: 'unread',
        range: '7d',
        search: 'login',
        ...handlers,
      })
    )

    expect(screen.getByLabelText('Search')).toHaveValue('login')
    expect(screen.getByLabelText('Type')).toHaveValue('security')
    expect(screen.getByLabelText('Status')).toHaveValue('unread')
    expect(screen.getByLabelText('Date range')).toHaveValue('7d')
  })

  test('calls change handlers when filters update', async () => {
    render(
      React.createElement(NotificationFilters, {
        category: 'all',
        status: 'all',
        range: 'all',
        search: '',
        ...handlers,
      })
    )

    await userEvent.type(screen.getByLabelText('Search'), 'comment')
    expect(handlers.onSearchChange).toHaveBeenCalled()

    await userEvent.selectOptions(screen.getByLabelText('Type'), 'content')
    expect(handlers.onCategoryChange).toHaveBeenCalledWith('content')

    await userEvent.selectOptions(screen.getByLabelText('Status'), 'read')
    expect(handlers.onStatusChange).toHaveBeenCalledWith('read')

    await userEvent.selectOptions(screen.getByLabelText('Date range'), '30d')
    expect(handlers.onRangeChange).toHaveBeenCalledWith('30d')
  })
})
