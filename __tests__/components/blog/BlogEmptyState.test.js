const React = require('react')
const { render, screen } = require('@testing-library/react')
const { BlogEmptyState } = require('@/components/blog/BlogEmptyState')

describe('BlogEmptyState', () => {
  test('renders title, description, and browse link', () => {
    render(
      React.createElement(BlogEmptyState, {
        title: 'No articles yet',
        description: 'Check back soon.',
      })
    )

    expect(screen.getByRole('heading', { name: 'No articles yet' })).toBeInTheDocument()
    expect(screen.getByText('Check back soon.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Browse all articles/i })).toHaveAttribute(
      'href',
      '/blog'
    )
  })
})
