const { test, expect } = require('@playwright/test')
const { loginAsAdmin } = require('./utils/admin-auth')
const { loginEmailInput, loginPasswordInput } = require('./utils/page')

test.describe('Authentication', () => {
  test.describe.configure({ mode: 'serial' })
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
    const signInButton = page.getByRole('button', { name: 'Sign In' })
    await expect(signInButton).toBeEnabled({ timeout: 15000 })
    await loginEmailInput(page).fill('admin@example.com')
    await loginPasswordInput(page).fill('wrong-password')
    await signInButton.click()
    await expect(page.getByRole('alert').filter({ hasText: /incorrect/i })).toBeVisible()
    await expect(page).toHaveURL(/\/login/)
  })

  test('logs in with seeded superadmin credentials', async ({ page }) => {
    await loginAsAdmin(page)
    await expect(page).toHaveURL(/\/admin/)
    await expect(page.locator('[data-admin-theme]')).toBeVisible()
  })
})
