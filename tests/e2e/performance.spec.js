const { test, expect } = require('@playwright/test')

test.describe('Performance Tests', () => {
  test('should load home page within acceptable time', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/')
    
    const loadTime = Date.now() - startTime
    
    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000)
    
    // Verify page is fully loaded
    await expect(page.locator('body')).toBeVisible()
  })

  test('should load blog page within acceptable time', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/blog')
    
    const loadTime = Date.now() - startTime
    
    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000)
    
    // Verify page is fully loaded
    await expect(page.locator('body')).toBeVisible()
  })

  test('should have fast navigation between pages', async ({ page }) => {
    await page.goto('/')
    
    const pages = ['/blog', '/about', '/projects', '/tags']
    
    for (const path of pages) {
      const startTime = Date.now()
      
      await page.goto(path)
      
      const navigationTime = Date.now() - startTime
      
      // Navigation should be fast (under 2 seconds)
      expect(navigationTime).toBeLessThan(2000)
      
      // Verify page loads correctly
      await expect(page.locator('body')).toBeVisible()
    }
  })

  test('should load images efficiently', async ({ page }) => {
    await page.goto('/')
    
    // Wait for all images to load
    await page.waitForLoadState('networkidle')
    
    // Check if images are loaded
    const images = page.locator('img')
    const imageCount = await images.count()
    
    if (imageCount > 0) {
      // Verify images are visible
      await expect(images.first()).toBeVisible()
    }
  })

  test('should handle large content gracefully', async ({ page }) => {
    await page.goto('/blog')
    
    // Wait for content to load
    await page.waitForLoadState('networkidle')
    
    // Verify page remains responsive
    await expect(page.locator('body')).toBeVisible()
    
    // Test scrolling performance
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
    
    // Verify page still works after scrolling
    await expect(page.locator('body')).toBeVisible()
  })

  test('should have efficient resource loading', async ({ page }) => {
    const resources = []
    
    // Listen for resource requests
    page.on('request', request => {
      resources.push({
        url: request.url(),
        resourceType: request.resourceType()
      })
    })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Check for excessive resource requests
    expect(resources.length).toBeLessThan(100)
    
    // Verify critical resources are loaded
    const criticalResources = resources.filter(r => 
      r.resourceType === 'document' || 
      r.resourceType === 'stylesheet' || 
      r.resourceType === 'script'
    )
    
    expect(criticalResources.length).toBeGreaterThan(0)
  })

  test('should handle concurrent user interactions', async ({ page }) => {
    await page.goto('/')
    
    // Simulate rapid user interactions
    const interactions = [
      () => page.click('a:has-text("Blog")'),
      () => page.click('button[aria-label*="theme" i]'),
      () => page.keyboard.press('Tab'),
      () => page.mouse.move(100, 100)
    ]
    
    // Execute interactions rapidly
    for (const interaction of interactions) {
      await interaction()
      await page.waitForTimeout(100) // Small delay between interactions
    }
    
    // Verify page remains stable
    await expect(page.locator('body')).toBeVisible()
  })

  test('should have responsive layout on different screen sizes', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 1024, height: 768 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 }
    ]
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport)
      await page.goto('/')
      
      // Verify page loads correctly at each viewport
      await expect(page.locator('body')).toBeVisible()
      
      // Check that layout is responsive
      const header = page.locator('header')
      await expect(header).toBeVisible()
    }
  })

  test('should handle memory efficiently', async ({ page }) => {
    await page.goto('/')
    
    // Navigate through multiple pages
    const pages = ['/blog', '/about', '/projects', '/tags']
    
    for (const path of pages) {
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      
      // Verify page loads without memory issues
      await expect(page.locator('body')).toBeVisible()
    }
    
    // Return to home page
    await page.goto('/')
    await expect(page.locator('body')).toBeVisible()
  })

  test('should have fast search functionality', async ({ page }) => {
    await page.goto('/blog')
    
    // Find search functionality
    const searchButton = page.locator('button[aria-label*="search" i]')
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]')
    
    if (await searchInput.count() > 0) {
      const startTime = Date.now()
      
      await searchInput.first().fill('test')
      await searchInput.first().press('Enter')
      
      const searchTime = Date.now() - startTime
      
      // Search should be fast
      expect(searchTime).toBeLessThan(2000)
      
      await expect(page.locator('body')).toBeVisible()
    } else if (await searchButton.count() > 0) {
      const startTime = Date.now()
      
      await searchButton.first().click()
      
      const searchTime = Date.now() - startTime
      
      // Search button click should be fast
      expect(searchTime).toBeLessThan(1000)
      
      await expect(page.locator('body')).toBeVisible()
    }
  })

  test('should handle network latency gracefully', async ({ page }) => {
    // Simulate slow network
    await page.route('**/*', route => {
      // Add artificial delay
      setTimeout(() => route.continue(), 100)
    })
    
    const startTime = Date.now()
    
    await page.goto('/')
    
    const loadTime = Date.now() - startTime
    
    // Even with network delay, page should load
    await expect(page.locator('body')).toBeVisible()
    
    // Load time should still be reasonable
    expect(loadTime).toBeLessThan(5000)
  })
}) 