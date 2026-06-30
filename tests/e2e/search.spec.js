const { test, expect } = require('./fixtures')
const { desktopNavLink } = require('./utils/page')

function searchForm(page) {
  return page.locator('form[action="/search"]')
}

function searchInput(page) {
  return searchForm(page).getByPlaceholder('Search articles…')
}

function searchSubmitButton(page) {
  return searchForm(page).getByRole('button', { name: 'Search' })
}

test.describe('Search page', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
  })

  test('loads from header navigation link', async ({ page }) => {
    await page.goto('/')
    const searchLink = desktopNavLink(page, 'Search')
    await expect(searchLink).toBeVisible({ timeout: 15_000 })
    await Promise.all([page.waitForURL(/\/search/), searchLink.click()])
    await expect(page.getByRole('heading', { name: 'Search', level: 1 })).toBeVisible()
  })

  test('shows search form', async ({ page }) => {
    await page.goto('/search')
    await expect(searchInput(page)).toBeVisible()
    await expect(searchSubmitButton(page)).toBeVisible()
  })

  test('accepts search query', async ({ page }) => {
    await page.goto('/search')
    const input = searchInput(page)
    await input.fill('blog')
    await searchSubmitButton(page).click()
    await expect(page).toHaveURL(/\/search\?q=blog/)
    await expect(input).toHaveValue('blog')
  })

  test('shows empty state for unknown query', async ({ page }) => {
    await page.goto('/search?q=zzzznotarealquery99999')
    await expect(page.getByText(/No results for/)).toBeVisible()
  })
})
