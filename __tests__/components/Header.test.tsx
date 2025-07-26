import React from 'react'
import { render, screen } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'

// Mock the usePathname hook
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

describe('Header Component', () => {
  const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>

  beforeEach(() => {
    mockUsePathname.mockReturnValue('/')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renders header with correct structure', () => {
    render(<Header />)
    
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
    expect(header).toHaveClass('flex', 'items-center', 'justify-between', 'py-10')
  })

  test('renders logo with correct text', () => {
    render(<Header />)
    
    const logo = screen.getByText(/~\/$/)
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveClass('text-primary-color', 'dark:text-primary-color-dark')
  })

  test('renders navigation links', () => {
    render(<Header />)
    
    // Check that navigation links are rendered (excluding home page)
    const navLinks = headerNavLinks.filter(link => link.href !== '/')
    
    navLinks.forEach(link => {
      const linkElement = screen.getByText(link.title)
      expect(linkElement).toBeInTheDocument()
      expect(linkElement).toHaveAttribute('href', link.href)
    })
  })

  test('renders search button', () => {
    render(<Header />)
    
    // SearchButton should be rendered (it's a component, so we check for its presence)
    const searchButton = screen.getByRole('button', { name: /search/i })
    expect(searchButton).toBeInTheDocument()
  })

  test('renders theme switch', () => {
    render(<Header />)
    
    // ThemeSwitch should be rendered
    const themeSwitch = screen.getByRole('button', { name: /toggle theme/i })
    expect(themeSwitch).toBeInTheDocument()
  })

  test('renders mobile navigation', () => {
    render(<Header />)
    
    // MobileNav should be rendered
    const mobileNav = screen.getByRole('button', { name: /open menu/i })
    expect(mobileNav).toBeInTheDocument()
  })

  test('displays correct pathname in logo', () => {
    mockUsePathname.mockReturnValue('/blog')
    render(<Header />)
    
    const logo = screen.getByText(/~\/blog$/)
    expect(logo).toBeInTheDocument()
  })

  test('logo links to home page', () => {
    render(<Header />)
    
    const logoLink = screen.getByRole('link', { name: siteMetadata.headerTitle })
    expect(logoLink).toHaveAttribute('href', '/')
  })

  test('navigation links have correct styling', () => {
    render(<Header />)
    
    const navLinks = headerNavLinks.filter(link => link.href !== '/')
    
    navLinks.forEach(link => {
      const linkElement = screen.getByText(link.title)
      expect(linkElement).toHaveClass('hidden', 'font-medium', 'text-gray-900', 'sm:block', 'dark:text-gray-100')
    })
  })

  test('header has correct responsive classes', () => {
    render(<Header />)
    
    const header = screen.getByRole('banner')
    const navContainer = header.querySelector('div:last-child')
    
    expect(navContainer).toHaveClass('flex', 'items-center', 'space-x-4', 'leading-5', 'sm:space-x-6')
  })

  test('renders with different pathnames', () => {
    const testPaths = ['/', '/blog', '/about', '/projects', '/tags']
    
    testPaths.forEach(path => {
      mockUsePathname.mockReturnValue(path)
      const { unmount } = render(<Header />)
      
      const logo = screen.getByText(new RegExp(`~${path.replace('/', '\\/')}$`))
      expect(logo).toBeInTheDocument()
      
      unmount()
    })
  })

  test('excludes home link from navigation', () => {
    render(<Header />)
    
    const homeLink = screen.queryByText('Home')
    expect(homeLink).not.toBeInTheDocument()
  })

  test('all navigation links are accessible', () => {
    render(<Header />)
    
    const navLinks = headerNavLinks.filter(link => link.href !== '/')
    
    navLinks.forEach(link => {
      const linkElement = screen.getByRole('link', { name: link.title })
      expect(linkElement).toBeInTheDocument()
      expect(linkElement).toBeVisible()
    })
  })
}) 