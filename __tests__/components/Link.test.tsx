import React from 'react'
import { render, screen } from '@testing-library/react'
import Link from '@/components/Link'

describe('Link Component', () => {
  test('renders internal link correctly', () => {
    render(<Link href="/blog">Blog</Link>)
    
    const link = screen.getByRole('link', { name: 'Blog' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/blog')
  })

  test('renders external link correctly', () => {
    render(<Link href="https://example.com">External Link</Link>)
    
    const link = screen.getByRole('link', { name: 'External Link' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  test('renders with custom className', () => {
    render(<Link href="/test" className="custom-class">Test Link</Link>)
    
    const link = screen.getByRole('link', { name: 'Test Link' })
    expect(link).toHaveClass('custom-class')
  })

  test('renders with children', () => {
    render(
      <Link href="/test">
        <span>Child Element</span>
      </Link>
    )
    
    const childElement = screen.getByText('Child Element')
    expect(childElement).toBeInTheDocument()
  })

  test('renders with aria-label', () => {
    render(<Link href="/test" aria-label="Accessible Link">Test</Link>)
    
    const link = screen.getByRole('link', { name: 'Accessible Link' })
    expect(link).toBeInTheDocument()
  })

  test('handles empty href gracefully', () => {
    render(<Link href="">Empty Link</Link>)
    
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
      const { unmount } = render(<Link href={href}>Test</Link>)
      
      const link = screen.getByRole('link', { name: 'Test' })
      expect(link).toHaveAttribute('href', expected)
      
      unmount()
    })
  })
}) 