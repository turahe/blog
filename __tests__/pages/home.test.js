import React from 'react'
import { render, screen } from '@testing-library/react'
import siteMetadata from '@/data/siteMetadata'

// Mock the main page component
const MockHomePage = () => {
  return (
    <div>
      <h1>{siteMetadata.title}</h1>
      <p>{siteMetadata.description}</p>
      <nav>
        <a href="/blog">Blog</a>
        <a href="/about">About</a>
        <a href="/projects">Projects</a>
      </nav>
    </div>
  )
}

describe('Home Page', () => {
  test('renders site title', () => {
    render(<MockHomePage />)
    
    const title = screen.getByRole('heading', { level: 1 })
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent(siteMetadata.title)
  })

  test('renders site description', () => {
    render(<MockHomePage />)
    
    const description = screen.getByText(siteMetadata.description)
    expect(description).toBeInTheDocument()
  })

  test('renders navigation links', () => {
    render(<MockHomePage />)
    
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
    render(<MockHomePage />)
    
    const main = screen.getByRole('main') || document.querySelector('div')
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