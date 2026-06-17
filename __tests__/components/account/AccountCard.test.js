const React = require('react')
const { render, screen } = require('@testing-library/react')
const { AccountCard } = require('@/components/account/AccountCard')

describe('AccountCard', () => {
  test('renders title and children', () => {
    render(
      React.createElement(
        AccountCard,
        { title: 'Profile' },
        React.createElement('input', { 'aria-label': 'Name' })
      )
    )
    expect(screen.getByRole('heading', { name: 'Profile' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument()
  })

  test('renders optional description', () => {
    render(
      React.createElement(AccountCard, {
        title: 'Security',
        description: 'Manage your password.',
      })
    )
    expect(screen.getByText('Manage your password.')).toBeInTheDocument()
  })
})
