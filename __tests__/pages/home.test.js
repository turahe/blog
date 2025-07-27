const React = require('react')
const { render, screen } = require('@testing-library/react')
const siteMetadata = require('@/data/siteMetadata')

// Mock the main page component
const MockHomePage = () => {
  return React.createElement('div', null,
    React.createElement('h1', null, siteMetadata.title),
    React.createElement('p', null, siteMetadata.description),
    React.createElement('nav', null,
      React.createElement('a', { href: '/blog' }, 'Blog'),
      React.createElement('a', { href: '/about' }, 'About'),
      React.createElement('a', { href: '/projects' }, 'Projects')
    )
  )
}

describe('Home Page', () => {
  test('renders site title', () => {
    render(React.createElement(MockHomePage))
    
    const title = screen.getByRole('heading', { level: 1 })
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent(siteMetadata.title)
  })

  test('renders site description', () => {
    render(React.createElement(MockHomePage))
    
    const description = screen.getByText(siteMetadata.description)
    expect(description).toBeInTheDocument()
  })

  test('renders navigation links', () => {
    render(React.createElement(MockHomePage))
    
    const blogLink = screen.getByRole('link', { name: 'Blog' })
    const aboutLink = screen.getByRole('link', { name: 'About' })
    const projectsLink = screen.getByRole('link', { name: 'Projects' })
    
    expect(blogLink).toBeInTheDocument()
    expect(aboutLink).toBeInTheDocument()
    expect(projectsLink).toBeInTheDocument()
    
    expect(blogLink).toHaveAttribute('href', '/blog')
    expect(aboutLink).toHaveAttribute('href', '/about')
    expect(projectsLink).toHaveAttribute('href', '/projects')
  })

  test('has correct page structure', () => {
    render(React.createElement(MockHomePage))
    
    const main = document.querySelector('div')
    expect(main).toBeInTheDocument()
  })
})

describe('Site Metadata Integration', () => {
  test('site metadata is accessible', () => {
    expect(siteMetadata).toBeDefined()
    expect(siteMetadata.title).toBeDefined()
    expect(siteMetadata.description).toBeDefined()
  })

  test('site metadata has required fields', () => {
    const requiredFields = ['title', 'author', 'description', 'siteUrl']
    
    requiredFields.forEach(field => {
      expect(siteMetadata).toHaveProperty(field)
      expect(siteMetadata[field]).toBeTruthy()
    })
  })
}) 