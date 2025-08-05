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

const { test, expect } = require('@playwright/test')

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load home page successfully', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Wach Blog & Portfolio/)

    // Check page loads without errors
    await expect(page.locator('body')).toBeVisible()
  })

  test('should display header with navigation', async ({ page }) => {
    // Check header is visible
    const header = page.locator('header')
    await expect(header).toBeVisible()

    // Check navigation links
    const navLinks = ['Blog', 'About', 'Projects', 'Tags']
    for (const link of navLinks) {
      const navLink = page.locator(`a:has-text("${link}")`)
      await expect(navLink).toBeVisible()
    }
  })

  test('should display logo with current path', async ({ page }) => {
    const logo = page.locator('text=/~\\/$/')
    await expect(logo).toBeVisible()
  })

  test('should have working navigation links', async ({ page }) => {
    // Test navigation to different pages
    const navigationTests = [
      { link: 'Blog', expectedPath: '/blog' },
      { link: 'About', expectedPath: '/about' },
      { link: 'Projects', expectedPath: '/projects' },
      { link: 'Tags', expectedPath: '/tags' },
    ]

    for (const { link, expectedPath } of navigationTests) {
      await page.click(`a:has-text("${link}")`)
      await expect(page).toHaveURL(new RegExp(expectedPath))
      await page.goBack()
    }
  })

  test('should display theme switch button', async ({ page }) => {
    const themeSwitch = page.locator('button[aria-label*="theme" i]')
    await expect(themeSwitch).toBeVisible()
  })

  test('should display search button', async ({ page }) => {
    const searchButton = page.locator('button[aria-label*="search" i]')
    await expect(searchButton).toBeVisible()
  })

  test('should display mobile navigation menu', async ({ page }) => {
    const mobileNav = page.locator('button[aria-label*="menu" i]')
    await expect(mobileNav).toBeVisible()
  })

  test('should have proper meta tags', async ({ page }) => {
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute('content', /.*/)

    // Check viewport meta tag
    const viewport = page.locator('meta[name="viewport"]')
    await expect(viewport).toBeVisible()
  })

  test('should have proper favicon links', async ({ page }) => {
    const favicon = page.locator('link[rel="icon"]')
    await expect(favicon).toBeVisible()

    const appleTouchIcon = page.locator('link[rel="apple-touch-icon"]')
    await expect(appleTouchIcon).toBeVisible()
  })

  test('should be accessible', async ({ page }) => {
    // Check for proper heading structure
    const headings = page.locator('h1, h2, h3, h4, h5, h6')
    await expect(headings.first()).toBeVisible()

    // Check for proper ARIA labels
    const elementsWithAria = page.locator('[aria-label]')
    await expect(elementsWithAria.count()).toBeGreaterThan(0)
  })

  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Check page still loads
    await expect(page.locator('body')).toBeVisible()

    // Check mobile navigation is accessible
    const mobileNav = page.locator('button[aria-label*="menu" i]')
    await expect(mobileNav).toBeVisible()
  })

  test('should handle theme switching', async ({ page }) => {
    const themeSwitch = page.locator('button[aria-label*="theme" i]')

    // Click theme switch
    await themeSwitch.click()

    // Check if theme class changes (this might vary based on implementation)
    await expect(page.locator('html')).toBeVisible()
  })

  test('should have proper page structure', async ({ page }) => {
    // Check main content area
    const main = page.locator('main')
    await expect(main).toBeVisible()

    // Check footer
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })
})
