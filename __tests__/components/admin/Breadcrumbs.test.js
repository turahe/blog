const React = require('react')
const { render, screen } = require('@testing-library/react')
const { Breadcrumbs } = require('@/components/admin/Breadcrumbs')

describe('Breadcrumbs', () => {
  test('renders home link and current page', () => {
    render(
      React.createElement(Breadcrumbs, {
        items: [{ label: 'Posts' }],
      })
    )

    expect(screen.getByRole('link', { name: /Home/i })).toHaveAttribute('href', '/admin')
    expect(screen.getByText('Posts')).toBeInTheDocument()
  })

  test('renders intermediate links', () => {
    render(
      React.createElement(Breadcrumbs, {
        items: [{ label: 'Content', href: '/admin/posts' }, { label: 'Edit Post' }],
      })
    )

    expect(screen.getByRole('link', { name: /Content/i })).toHaveAttribute('href', '/admin/posts')
    expect(screen.getByText('Edit Post')).toBeInTheDocument()
  })
})
