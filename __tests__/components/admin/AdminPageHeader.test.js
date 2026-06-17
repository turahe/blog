const React = require('react')
const { render, screen } = require('@testing-library/react')
const { AdminPageHeader } = require('@/components/admin/AdminPageHeader')

describe('AdminPageHeader', () => {
  test('renders title and description', () => {
    render(
      React.createElement(AdminPageHeader, {
        title: 'Users',
        description: 'Manage accounts',
      })
    )

    expect(screen.getByRole('heading', { name: 'Users' })).toBeInTheDocument()
    expect(screen.getByText('Manage accounts')).toBeInTheDocument()
  })

  test('renders action slot', () => {
    render(
      React.createElement(AdminPageHeader, {
        title: 'Posts',
        actions: React.createElement('button', { type: 'button' }, 'Create'),
      })
    )

    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument()
  })
})
