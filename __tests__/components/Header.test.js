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
const Header = require('@/components/Header').default
const siteMetadata = require('@/data/siteMetadata')

// Mock the usePathname hook
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}))

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders header with correct structure', () => {
    render(React.createElement(Header))
    
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
    expect(header).toHaveClass('flex', 'items-center', 'justify-between', 'py-10')
  })

  test('renders logo with correct text', () => {
    render(React.createElement(Header))
    
    const logo = screen.getByText(/~\/$/)
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveClass('text-primary-color', 'dark:text-primary-color-dark')
  })

  test('renders navigation links', () => {
    render(React.createElement(Header))
    
    // Check that main navigation links are rendered (desktop version)
    const blogLinks = screen.getAllByText('Blog')
    const tagsLinks = screen.getAllByText('Tags')
    const projectsLinks = screen.getAllByText('Projects')
    const aboutLinks = screen.getAllByText('About')
    
    expect(blogLinks.length).toBeGreaterThan(0)
    expect(tagsLinks.length).toBeGreaterThan(0)
    expect(projectsLinks.length).toBeGreaterThan(0)
    expect(aboutLinks.length).toBeGreaterThan(0)
    
    // Check that at least one of each link has the correct href
    expect(blogLinks.some(link => link.getAttribute('href') === '/blog')).toBe(true)
    expect(tagsLinks.some(link => link.getAttribute('href') === '/tags')).toBe(true)
    expect(projectsLinks.some(link => link.getAttribute('href') === '/projects')).toBe(true)
    expect(aboutLinks.some(link => link.getAttribute('href') === '/about')).toBe(true)
  })

  test('renders search button', () => {
    render(React.createElement(Header))
    
    const searchButton = screen.getByRole('button', { name: /search/i })
    expect(searchButton).toBeInTheDocument()
  })

  test('renders theme switch', () => {
    render(React.createElement(Header))
    
    const themeSwitch = screen.getByRole('button', { name: /toggle dark mode/i })
    expect(themeSwitch).toBeInTheDocument()
  })

  test('renders mobile navigation', () => {
    render(React.createElement(Header))
    
    const mobileNavButtons = screen.getAllByRole('button', { name: /toggle menu/i })
    expect(mobileNavButtons.length).toBeGreaterThan(0)
  })

  test('displays correct pathname in logo', () => {
    // Mock usePathname to return different path
    const { usePathname } = require('next/navigation')
    usePathname.mockReturnValue('/blog')
    
    render(React.createElement(Header))
    
    const logo = screen.getByText(/~\/blog$/)
    expect(logo).toBeInTheDocument()
  })

  test('logo links to home page', () => {
    render(React.createElement(Header))
    
    const logoLink = screen.getByRole('link', { name: siteMetadata.headerTitle })
    expect(logoLink).toHaveAttribute('href', '/')
  })

  test('includes home link in mobile navigation', () => {
    render(React.createElement(Header))
    
    const homeLink = screen.getByText('Home')
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')
  })

  test('renders with different pathnames', () => {
    const testPaths = ['/', '/blog', '/about', '/projects', '/tags']
    
    testPaths.forEach(path => {
      const { usePathname } = require('next/navigation')
      usePathname.mockReturnValue(path)
      
      const { unmount } = render(React.createElement(Header))
      
      const logo = screen.getByText(new RegExp(`~${path.replace('/', '\\/')}$`))
      expect(logo).toBeInTheDocument()
      
      unmount()
    })
  })
}) 