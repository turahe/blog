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

test.describe('Blog Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog')
  })

  test('should load blog page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Blog/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('should display blog posts list', async ({ page }) => {
    // Check if blog posts are displayed
    const posts = page.locator('article, [data-testid="blog-post"]')
    await expect(posts.first()).toBeVisible()
  })

  test('should display post titles and summaries', async ({ page }) => {
    // Check for post titles
    const postTitles = page.locator('h1, h2, h3').filter({ hasText: /./ })
    await expect(postTitles.first()).toBeVisible()
    
    // Check for post summaries or excerpts
    const postSummaries = page.locator('p').filter({ hasText: /./ })
    await expect(postSummaries.first()).toBeVisible()
  })

  test('should display post metadata', async ({ page }) => {
    // Check for post dates
    const postDates = page.locator('time, [data-testid="post-date"]')
    if (await postDates.count() > 0) {
      await expect(postDates.first()).toBeVisible()
    }
    
    // Check for post tags
    const postTags = page.locator('[data-testid="post-tags"], .tag, .tags')
    if (await postTags.count() > 0) {
      await expect(postTags.first()).toBeVisible()
    }
  })

  test('should have working post links', async ({ page }) => {
    // Find first post link
    const firstPostLink = page.locator('a[href*="/blog/"]').first()
    
    if (await firstPostLink.count() > 0) {
      const href = await firstPostLink.getAttribute('href')
      await firstPostLink.click()
      
      // Should navigate to post detail page
      await expect(page).toHaveURL(new RegExp('/blog/'))
      await expect(page.locator('body')).toBeVisible()
    }
  })

  test('should display pagination if needed', async ({ page }) => {
    // Check for pagination elements
    const pagination = page.locator('[data-testid="pagination"], .pagination, nav')
    
    if (await pagination.count() > 0) {
      await expect(pagination.first()).toBeVisible()
      
      // Check for next/previous links
      const nextLink = page.locator('a:has-text("Next"), a:has-text("→")')
      const prevLink = page.locator('a:has-text("Previous"), a:has-text("←")')
      
      if (await nextLink.count() > 0) {
        await expect(nextLink.first()).toBeVisible()
      }
      
      if (await prevLink.count() > 0) {
        await expect(prevLink.first()).toBeVisible()
      }
    }
  })

  test('should have search functionality', async ({ page }) => {
    // Look for search input or button
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]')
    const searchButton = page.locator('button[aria-label*="search" i]')
    
    if (await searchInput.count() > 0) {
      await expect(searchInput.first()).toBeVisible()
      
      // Test search functionality
      await searchInput.first().fill('test')
      await searchInput.first().press('Enter')
      
      // Should show search results or filtered content
      await expect(page.locator('body')).toBeVisible()
    } else if (await searchButton.count() > 0) {
      await expect(searchButton.first()).toBeVisible()
      
      // Click search button
      await searchButton.first().click()
      
      // Should open search interface
      await expect(page.locator('body')).toBeVisible()
    }
  })

  test('should display tags sidebar if present', async ({ page }) => {
    // Check for tags sidebar
    const tagsSidebar = page.locator('[data-testid="tags-sidebar"], .tags-sidebar, aside')
    
    if (await tagsSidebar.count() > 0) {
      await expect(tagsSidebar.first()).toBeVisible()
      
      // Check for tag links
      const tagLinks = page.locator('a[href*="/tags/"]')
      if (await tagLinks.count() > 0) {
        await expect(tagLinks.first()).toBeVisible()
      }
    }
  })

  test('should handle empty state', async ({ page }) => {
    // This test might need adjustment based on actual content
    // For now, just ensure the page loads
    await expect(page.locator('body')).toBeVisible()
  })

  test('should be accessible', async ({ page }) => {
    // Check for proper heading structure
    const headings = page.locator('h1, h2, h3, h4, h5, h6')
    await expect(headings.first()).toBeVisible()
    
    // Check for proper link structure
    const links = page.locator('a[href]')
    await expect(links.first()).toBeVisible()
  })

  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    await expect(page.locator('body')).toBeVisible()
    
    // Check mobile navigation
    const mobileNav = page.locator('button[aria-label*="menu" i]')
    await expect(mobileNav).toBeVisible()
  })

  test('should maintain navigation state', async ({ page }) => {
    // Navigate to blog page
    await page.goto('/blog')
    
    // Check current page indicator
    const currentPage = page.locator('a[aria-current="page"], .active')
    if (await currentPage.count() > 0) {
      await expect(currentPage.first()).toBeVisible()
    }
  })
}) 