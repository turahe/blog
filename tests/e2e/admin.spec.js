const { test, expect } = require('@playwright/test')
const { loginAsAdmin } = require('./utils/admin-auth')

test.describe('Admin area', () => {
  test.describe.configure({ mode: 'serial' })

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await loginAsAdmin(page)
  })

  test('loads dashboard', async ({ page }) => {
    await expect(page).toHaveURL(/\/admin/)
    await expect(page.locator('[data-admin-theme]')).toBeVisible({ timeout: 15000 })
  })

  test('sidebar links navigate to core sections', async ({ page }) => {
    const routes = [
      { href: '/admin/posts', heading: 'Posts' },
      { href: '/admin/projects', heading: 'Projects' },
      { href: '/admin/users', heading: 'Users' },
      { href: '/admin/experience', heading: 'Experience' },
      { href: '/admin/media', heading: 'Media Library' },
      { href: '/admin/settings', heading: 'General' },
    ]

    for (const route of routes) {
      await page.locator(`aside a[href="${route.href}"]`).first().click()
      await page.waitForURL(new RegExp(route.href.replace('/', '\\/')))
      await expect(page.getByRole('heading', { name: route.heading }).first()).toBeVisible()
    }
  })

  test('header theme toggle switches document theme class', async ({ page }) => {
    const toggle = page.getByRole('button', { name: /Switch to (dark|light) mode/i })
    await expect(toggle).toBeVisible()

    const html = page.locator('html')
    const before = await html.evaluate((el) => el.className)

    await toggle.click()
    await expect.poll(async () => html.evaluate((el) => el.className)).not.toBe(before)

    await toggle.click()
  })

  test('view site link returns to public homepage', async ({ page }) => {
    await page.getByRole('link', { name: 'View site' }).click()
    await expect(page).toHaveURL('/')
    await expect(page.locator('main.mb-auto')).toBeVisible()
  })
})
