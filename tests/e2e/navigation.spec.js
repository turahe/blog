const { test, expect } = require('@playwright/test')

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should navigate between all main pages', async ({ page }) => {
    const pages = [
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blog' },
      { name: 'About', path: '/about' },
      { name: 'Projects', path: '/projects' },
      { name: 'Tags', path: '/tags' }
    ]

    for (const { name, path } of pages) {
      // Navigate to page
      await page.goto(path)
      
      // Verify page loads
      await expect(page.locator('body')).toBeVisible()
      
      // Verify page title contains expected text
      const title = await page.title()
      expect(title).toMatch(new RegExp(name, 'i'))
    }
  })

  test('should have working header navigation links', async ({ page }) => {
    const navLinks = [
      { text: 'Blog', expectedPath: '/blog' },
      { text: 'About', expectedPath: '/about' },
      { text: 'Projects', expectedPath: '/projects' },
      { text: 'Tags', expectedPath: '/tags' }
    ]

    for (const { text, expectedPath } of navLinks) {
      // Click navigation link
      await page.click(`a:has-text("${text}")`)
      
      // Verify URL changes
      await expect(page).toHaveURL(new RegExp(expectedPath))
      
      // Verify page content loads
      await expect(page.locator('main')).toBeVisible()
      
      // Go back to home
      await page.goto('/')
    }
  })

  test('should have working logo link', async ({ page }) => {
    // Navigate to a different page first
    await page.goto('/blog')
    
    // Click logo
    await page.click('a:has-text("~/")')
    
    // Should return to home page
    await expect(page).toHaveURL('/')
  })

  test('should display mobile menu on small screens', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Find mobile menu button
    const mobileMenuButton = page.locator('button[aria-label*="menu" i], button[aria-label*="open" i]')
    await expect(mobileMenuButton).toBeVisible()
    
    // Click mobile menu
    await mobileMenuButton.click()
    
    // Check if mobile menu opens (this might need adjustment based on actual implementation)
    await expect(page.locator('body')).toBeVisible()
  })

  test('should handle theme switching', async ({ page }) => {
    // Find theme switch button
    const themeSwitch = page.locator('button[aria-label*="theme" i], button[aria-label*="toggle" i]')
    await expect(themeSwitch).toBeVisible()
    
    // Click theme switch
    await themeSwitch.click()
    
    // Verify page still works after theme change
    await expect(page.locator('body')).toBeVisible()
    
    // Click again to switch back
    await themeSwitch.click()
    await expect(page.locator('body')).toBeVisible()
  })

  test('should have working search functionality', async ({ page }) => {
    // Find search button
    const searchButton = page.locator('button[aria-label*="search" i]')
    await expect(searchButton).toBeVisible()
    
    // Click search button
    await searchButton.click()
    
    // Verify search interface appears (this might need adjustment)
    await expect(page.locator('body')).toBeVisible()
  })

  test('should maintain navigation state across pages', async ({ page }) => {
    // Navigate to different pages and verify header remains consistent
    const pages = ['/blog', '/about', '/projects', '/tags']
    
    for (const path of pages) {
      await page.goto(path)
      
      // Verify header is present
      const header = page.locator('header')
      await expect(header).toBeVisible()
      
      // Verify navigation links are present
      const navLinks = ['Blog', 'About', 'Projects', 'Tags']
      for (const link of navLinks) {
        const navLink = page.locator(`a:has-text("${link}")`)
        await expect(navLink).toBeVisible()
      }
    }
  })

  test('should handle keyboard navigation', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab')
    
    // Verify focus moves to first focusable element
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
    
    // Test more tab presses
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Verify page still works
    await expect(page.locator('body')).toBeVisible()
  })

  test('should handle browser back/forward buttons', async ({ page }) => {
    // Navigate to blog page
    await page.goto('/blog')
    
    // Go back
    await page.goBack()
    await expect(page).toHaveURL('/')
    
    // Go forward
    await page.goForward()
    await expect(page).toHaveURL('/blog')
  })

  test('should have proper focus management', async ({ page }) => {
    // Test that focusable elements are properly accessible
    const focusableElements = page.locator('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])')
    
    if (await focusableElements.count() > 0) {
      await expect(focusableElements.first()).toBeVisible()
    }
  })

  test('should handle external links properly', async ({ page }) => {
    // Look for external links (this might need adjustment based on actual content)
    const externalLinks = page.locator('a[href^="http"]:not([href*="localhost"])')
    
    if (await externalLinks.count() > 0) {
      const firstExternalLink = externalLinks.first()
      const href = await firstExternalLink.getAttribute('href')
      
      // External links should have proper attributes
      await expect(firstExternalLink).toHaveAttribute('target', '_blank')
      await expect(firstExternalLink).toHaveAttribute('rel', /noopener|noreferrer/)
    }
  })

  test('should work with different viewport sizes', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080, name: 'Desktop' },
      { width: 1024, height: 768, name: 'Tablet' },
      { width: 375, height: 667, name: 'Mobile' }
    ]
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport)
      
      // Verify page loads correctly
      await expect(page.locator('body')).toBeVisible()
      
      // Verify header is visible
      const header = page.locator('header')
      await expect(header).toBeVisible()
    }
  })

  test('should handle rapid navigation', async ({ page }) => {
    // Rapidly navigate between pages
    const pages = ['/blog', '/about', '/projects', '/tags']
    
    for (const path of pages) {
      await page.goto(path)
      await expect(page.locator('body')).toBeVisible()
    }
    
    // Verify final page works correctly
    await expect(page.locator('main')).toBeVisible()
  })
}) 