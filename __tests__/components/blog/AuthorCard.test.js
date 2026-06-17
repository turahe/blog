const React = require('react')
const { render, screen } = require('@testing-library/react')
const { AuthorByline, AuthorCard } = require('@/components/blog/AuthorCard')

describe('AuthorByline', () => {
  test('links to author page', () => {
    render(React.createElement(AuthorByline, { name: 'Jane Doe', slug: 'jane-doe' }))
    expect(screen.getByRole('link', { name: 'Jane Doe' })).toHaveAttribute(
      'href',
      '/author/jane-doe'
    )
  })
})

describe('AuthorCard', () => {
  test('renders author name and post count', () => {
    render(
      React.createElement(AuthorCard, {
        author: { name: 'Jane Doe', slug: 'jane-doe' },
        postCount: 4,
      })
    )
    expect(screen.getByRole('heading', { name: 'Jane Doe' })).toBeInTheDocument()
    expect(screen.getByText('4 articles')).toBeInTheDocument()
  })

  test('renders occupation and company', () => {
    render(
      React.createElement(AuthorCard, {
        author: {
          name: 'Jane Doe',
          slug: 'jane-doe',
          occupation: 'Engineer',
          company: 'Acme',
        },
      })
    )
    expect(screen.getByText('Engineer · Acme')).toBeInTheDocument()
  })
})
