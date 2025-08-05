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

// E2E Test Helper Utilities

/**
 * Wait for page to be fully loaded
 */
export async function waitForPageLoad(page) {
  await page.waitForLoadState('networkidle')
  await page.waitForLoadState('domcontentloaded')
}

/**
 * Navigate to a page and wait for it to load
 */
export async function navigateToPage(page, path) {
  await page.goto(path)
  await waitForPageLoad(page)
}

/**
 * Check if element is visible and clickable
 */
export async function isElementClickable(page, selector) {
  const element = page.locator(selector)
  await expect(element).toBeVisible()
  await expect(element).toBeEnabled()
  return element
}

/**
 * Take a screenshot with timestamp
 */
export async function takeScreenshot(page, name) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  await page.screenshot({ path: `test-results/${name}-${timestamp}.png` })
}

/**
 * Check page performance metrics
 */
export async function checkPagePerformance(page) {
  const performanceMetrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0]
    return {
      loadTime: navigation.loadEventEnd - navigation.loadEventStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
      firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
    }
  })
  
  return performanceMetrics
}

/**
 * Test responsive design at different viewports
 */
export async function testResponsiveDesign(page, testFunction) {
  const viewports = [
    { width: 1920, height: 1080, name: 'Desktop' },
    { width: 1024, height: 768, name: 'Tablet' },
    { width: 768, height: 1024, name: 'Tablet Portrait' },
    { width: 375, height: 667, name: 'Mobile' }
  ]
  
  for (const viewport of viewports) {
    await page.setViewportSize(viewport)
    await testFunction(page, viewport)
  }
}

/**
 * Check accessibility features
 */
export async function checkAccessibility(page) {
  // Check for proper heading structure
  const headings = page.locator('h1, h2, h3, h4, h5, h6')
  await expect(headings.first()).toBeVisible()
  
  // Check for ARIA labels
  const ariaElements = page.locator('[aria-label], [aria-labelledby]')
  const ariaCount = await ariaElements.count()
  
  // Check for focusable elements
  const focusableElements = page.locator('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])')
  const focusableCount = await focusableElements.count()
  
  return {
    hasHeadings: await headings.count() > 0,
    ariaElementsCount: ariaCount,
    focusableElementsCount: focusableCount
  }
}

/**
 * Test keyboard navigation
 */
export async function testKeyboardNavigation(page) {
  // Test tab navigation
  await page.keyboard.press('Tab')
  const firstFocused = page.locator(':focus')
  await expect(firstFocused).toBeVisible()
  
  // Test more tab presses
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  
  // Test escape key
  await page.keyboard.press('Escape')
  
  return true
}

/**
 * Check external links have proper attributes
 */
export async function checkExternalLinks(page) {
  const externalLinks = page.locator('a[href^="http"]:not([href*="localhost"])')
  const externalLinksCount = await externalLinks.count()
  
  if (externalLinksCount > 0) {
    for (let i = 0; i < Math.min(externalLinksCount, 5); i++) {
      const link = externalLinks.nth(i)
      await expect(link).toHaveAttribute('target', '_blank')
      await expect(link).toHaveAttribute('rel', /noopener|noreferrer/)
    }
  }
  
  return externalLinksCount
}

/**
 * Test theme switching functionality
 */
export async function testThemeSwitching(page) {
  const themeSwitch = page.locator('button[aria-label*="theme" i], button[aria-label*="toggle" i]')
  
  if (await themeSwitch.count() > 0) {
    // Click theme switch
    await themeSwitch.first().click()
    await page.waitForTimeout(500) // Wait for theme change
    
    // Click again to switch back
    await themeSwitch.first().click()
    await page.waitForTimeout(500)
    
    return true
  }
  
  return false
}

/**
 * Check page meta tags
 */
export async function checkMetaTags(page) {
  const metaTags = {
    description: await page.locator('meta[name="description"]').count(),
    viewport: await page.locator('meta[name="viewport"]').count(),
    robots: await page.locator('meta[name="robots"]').count(),
    ogTitle: await page.locator('meta[property="og:title"]').count(),
    ogDescription: await page.locator('meta[property="og:description"]').count(),
    twitterCard: await page.locator('meta[name="twitter:card"]').count()
  }
  
  return metaTags
}

/**
 * Test search functionality
 */
export async function testSearchFunctionality(page) {
  const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]')
  const searchButton = page.locator('button[aria-label*="search" i]')
  
  if (await searchInput.count() > 0) {
    await searchInput.first().fill('test')
    await searchInput.first().press('Enter')
    await page.waitForTimeout(1000)
    return 'input'
  } else if (await searchButton.count() > 0) {
    await searchButton.first().click()
    await page.waitForTimeout(1000)
    return 'button'
  }
  
  return null
}

/**
 * Generate test report data
 */
export async function generateTestReport(page, testName) {
  const performance = await checkPagePerformance(page)
  const accessibility = await checkAccessibility(page)
  const metaTags = await checkMetaTags(page)
  
  return {
    testName,
    timestamp: new Date().toISOString(),
    performance,
    accessibility,
    metaTags,
    url: page.url(),
    title: await page.title()
  }
} 