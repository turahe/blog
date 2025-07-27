const React = require('react')
const { render, screen } = require('@testing-library/react')
const Link = require('@/components/Link').default

describe('Link Component', () => {
  test('renders internal link correctly', () => {
    render(React.createElement(Link, { href: '/blog' }, 'Blog'))
    
    const link = screen.getByRole('link', { name: 'Blog' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/blog')
  })

  test('renders external link correctly', () => {
    render(React.createElement(Link, { href: 'https://example.com' }, 'External Link'))
    
    const link = screen.getByRole('link', { name: 'External Link' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  test('renders with custom className', () => {
    render(React.createElement(Link, { href: '/test', className: 'custom-class' }, 'Test Link'))
    
    const link = screen.getByRole('link', { name: 'Test Link' })
    expect(link).toHaveClass('custom-class')
  })

  test('renders with children', () => {
    render(React.createElement(Link, { href: '/test' }, 
      React.createElement('span', null, 'Child Element')
    ))
    
    const childElement = screen.getByText('Child Element')
    expect(childElement).toBeInTheDocument()
  })

  test('renders with aria-label', () => {
    render(React.createElement(Link, { href: '/test', 'aria-label': 'Accessible Link' }, 'Test'))
    
    const link = screen.getByRole('link', { name: 'Accessible Link' })
    expect(link).toBeInTheDocument()
  })

  test('handles empty href gracefully', () => {
    render(React.createElement(Link, { href: '' }, 'Empty Link'))
    
    const link = screen.getByRole('link', { name: 'Empty Link' })
    expect(link).toHaveAttribute('href', '')
  })

  test('renders with different href types', () => {
    const testCases = [
      { href: '/', expected: '/' },
      { href: '/blog', expected: '/blog' },
      { href: '/about', expected: '/about' },
      { href: 'https://github.com', expected: 'https://github.com' },
      { href: 'mailto:test@example.com', expected: 'mailto:test@example.com' },
    ]

    testCases.forEach(({ href, expected }) => {
      const { unmount } = render(React.createElement(Link, { href }, 'Test'))
      
      const link = screen.getByRole('link', { name: 'Test' })
      expect(link).toHaveAttribute('href', expected)
      
      unmount()
    })
  })
}) 