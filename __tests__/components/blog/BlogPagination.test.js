const React = require('react')
const { render, screen } = require('@testing-library/react')
const { BlogPagination } = require('@/components/blog/BlogPagination')

describe('BlogPagination', () => {
  test('returns null when only one page', () => {
    const { container } = render(
      React.createElement(BlogPagination, { basePath: '/blog', currentPage: 1, totalPages: 1 })
    )
    expect(container).toBeEmptyDOMElement()
  })

  test('shows page info and next link on first page', () => {
    render(
      React.createElement(BlogPagination, { basePath: '/blog', currentPage: 1, totalPages: 3 })
    )
    expect(screen.getByLabelText('Pagination')).toBeInTheDocument()
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Next →' })).toHaveAttribute('href', '/blog/page/2')
    expect(screen.queryByRole('link', { name: '← Previous' })).not.toBeInTheDocument()
  })

  test('links previous to base path on page 2', () => {
    render(
      React.createElement(BlogPagination, { basePath: '/blog', currentPage: 2, totalPages: 3 })
    )
    expect(screen.getByRole('link', { name: '← Previous' })).toHaveAttribute('href', '/blog')
    expect(screen.getByRole('link', { name: 'Next →' })).toHaveAttribute('href', '/blog/page/3')
  })

  test('disables next on last page', () => {
    render(
      React.createElement(BlogPagination, { basePath: '/blog', currentPage: 3, totalPages: 3 })
    )
    expect(screen.getByRole('link', { name: '← Previous' })).toHaveAttribute('href', '/blog/page/2')
    expect(screen.queryByRole('link', { name: 'Next →' })).not.toBeInTheDocument()
    expect(screen.getByText('Next →')).toBeInTheDocument()
  })
})
