const React = require('react')
const { render, screen } = require('@testing-library/react')
const { CategoryPill } = require('@/components/blog/CategoryPill')

describe('CategoryPill', () => {
  test('links to category page', () => {
    render(React.createElement(CategoryPill, { name: 'Tech', slug: 'tech' }))
    expect(screen.getByRole('link', { name: 'Tech' })).toHaveAttribute('href', '/category/tech')
  })

  test('shows optional post count', () => {
    render(React.createElement(CategoryPill, { name: 'News', slug: 'news', count: 5 }))
    expect(screen.getByRole('link', { name: /News \(5\)/ })).toBeInTheDocument()
  })
})
