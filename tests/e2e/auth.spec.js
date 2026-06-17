const { test, expect } = require('@playwright/test')
const { loginAsAdmin } = require('./utils/admin-auth')

test.describe('Authentication', () => {
  test('redirects unauthenticated users from admin to login', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/login/)
  })

  test('shows login form', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: 'Sign In' }).waitFor({ state: 'visible' })
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
  })

  test('rejects invalid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.locator('input[name="email"]').fill('admin@example.com')
    await page.locator('input[name="password"]').fill('wrong-password')
    await page.getByRole('button', { name: 'Sign In' }).click()
    await expect(page.getByRole('alert')).toBeVisible()
    await expect(page).toHaveURL(/\/login/)
  })

  test('logs in with seeded superadmin credentials', async ({ page }) => {
    await loginAsAdmin(page)
    await expect(page).toHaveURL(/\/admin/)
    await expect(page.locator('[data-admin-theme]')).toBeVisible()
  })
})
