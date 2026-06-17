const { test, expect } = require('@playwright/test')

test.describe('Search command palette', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('opens from header search button', async ({ page }) => {
    await page.getByRole('button', { name: 'Search' }).click()
    await expect(page.getByPlaceholder('Search articles...')).toBeVisible()
  })

  test('opens with keyboard shortcut', async ({ page }) => {
    const modifier = process.platform === 'darwin' ? 'Meta' : 'Control'
    await page.keyboard.press(`${modifier}+KeyK`)
    await expect(page.getByPlaceholder('Search articles...')).toBeVisible()
  })

  test('closes with Escape', async ({ page }) => {
    await page.getByRole('button', { name: 'Search' }).click()
    const input = page.getByPlaceholder('Search articles...')
    await expect(input).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(input).toBeHidden()
  })

  test('accepts search input', async ({ page }) => {
    await page.getByRole('button', { name: 'Search' }).click()
    const input = page.getByPlaceholder('Search articles...')
    await input.fill('blog')
    await expect(input).toHaveValue('blog')
  })
})
