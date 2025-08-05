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