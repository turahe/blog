/**
 * Admin authentication helpers for Playwright E2E tests.
 */

const { expect } = require('@playwright/test')

const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL || 'admin@example.com'
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD || 'ChangeMe123!'

/**
 * Sign in as the seeded superadmin user.
 */
async function loginAsAdmin(page) {
  await page.goto('/login')

  const signInButton = page.getByRole('button', { name: 'Sign In' })
  await signInButton.waitFor({ state: 'visible', timeout: 30000 })
  await expect(signInButton).toBeEnabled({ timeout: 15000 })

  await page.getByRole('textbox', { name: 'Email' }).fill(ADMIN_EMAIL)
  const { loginPasswordInput } = require('./page')
  await loginPasswordInput(page).fill(ADMIN_PASSWORD)

  await signInButton.click()

  await page.waitForURL(/\/admin/, { timeout: 30000 })
  await page.locator('[data-admin-theme]').waitFor({ state: 'visible', timeout: 15000 })
}

/**
 * Navigate to an admin route (requires an authenticated session).
 */
async function gotoAdminPage(page, path) {
  const { waitForPageReady } = require('./page')
  await page.goto(path)
  await waitForPageReady(page)
}

module.exports = {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  loginAsAdmin,
  gotoAdminPage,
}
