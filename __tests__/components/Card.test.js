const React = require('react')
const { render, screen } = require('@testing-library/react')
const Card = require('@/components/Card').default

describe('Card', () => {
  test('renders title, description, and learn more link', () => {
    render(
      React.createElement(Card, {
        title: 'My Project',
        description: 'A cool side project.',
        imgSrc: '/static/images/project.png',
        href: '/projects/my-project',
      })
    )
    expect(screen.getByText('My Project')).toBeInTheDocument()
    expect(screen.getByText('A cool side project.')).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Link to My Project' })).toHaveLength(3)
    const learnMore = screen.getByText('Learn more →')
    expect(learnMore.closest('a')).toHaveAttribute('href', '/projects/my-project')
  })

  test('renders image without links when href is empty', () => {
    render(
      React.createElement(Card, {
        title: 'Gallery',
        description: 'Photos only.',
        imgSrc: '/static/images/photo.png',
        href: '',
      })
    )
    expect(screen.getByRole('img', { name: 'Gallery' })).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
