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