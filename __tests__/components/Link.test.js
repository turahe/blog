/**
 * PROPRIETARY LICENSE
 *
 * Copyright (c) 2024 Nur Wachid. All rights reserved.
 *
 * This software and associated documentation files (the "Software") are the
 * proprietary and confidential information of Nur Wachid ("Licensor").
 * The Software is protected by copyright laws and international copyright
 * treaties, as well as other intellectual property laws and treaties.
 *
 * RESTRICTIONS:
 * - NO REDISTRIBUTION: You may not redistribute, sell, lease, rent,
 *   lend, or otherwise transfer the Software to any third party without
 *   the express written consent of Nur Wachid.
 * - NO MODIFICATION: You may not modify, adapt, alter, translate, or
 *   create derivative works based on the Software without the express
 *   written consent of Nur Wachid.
 * - NO REVERSE ENGINEERING: You may not reverse engineer, decompile,
 *   disassemble, or otherwise attempt to derive the source code of the
 *   Software.
 * - NO COMMERCIAL USE: You may not use the Software for any commercial
 *   purpose without the express written consent of Nur Wachid.
 * - PERSONAL USE ONLY: This Software is provided for personal,
 *   non-commercial use only.
 *
 * For licensing inquiries, commercial use, or other permissions, please
 * contact: Nur Wachid (wachid@outlook.com)
 *
 * @license PROPRIETARY
 * @author Nur Wachid <wachid@outlook.com>
 * @copyright 2024 Nur Wachid. All rights reserved.
 */

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
    render(
      React.createElement(
        Link,
        { href: '/test' },
        React.createElement('span', null, 'Child Element')
      )
    )

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

    const link = screen.getByText('Empty Link')
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
