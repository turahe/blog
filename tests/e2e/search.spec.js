const { test, expect } = require('@playwright/test')

async function openSearchPalette(page) {
  const searchButton = page.getByRole('button', { name: 'Search' })
  await expect(searchButton).toBeVisible()
  await searchButton.click()

  const input = page.locator('input[placeholder="Search articles..."]')
  await expect(input).toBeVisible({ timeout: 15000 })
  return input
}

test.describe('Search command palette', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Search' }).waitFor({ state: 'visible' })
  })

  test('opens from header search button', async ({ page }) => {
    const input = await openSearchPalette(page)
    await expect(input).toHaveAttribute('placeholder', 'Search articles...')
  })

  test('opens with keyboard shortcut', async ({ page }) => {
    await page.keyboard.press('Control+KeyK')
    const input = page.locator('input[placeholder="Search articles..."]')
    await expect(input).toBeVisible({ timeout: 15000 })
  })

  test('closes with Escape', async ({ page }) => {
    const input = await openSearchPalette(page)
    await page.keyboard.press('Escape')
    await expect(input).toHaveCount(0)
  })

  test('accepts search input', async ({ page }) => {
    const input = await openSearchPalette(page)
    await input.fill('blog')
    await expect(input).toHaveValue('blog')
  })
})
