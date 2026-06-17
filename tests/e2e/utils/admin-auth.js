/**
 * Admin authentication helpers for Playwright E2E tests.
 */

const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL || 'admin@example.com'
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD || 'ChangeMe123!'

/**
 * Sign in as the seeded superadmin user.
 */
async function loginAsAdmin(page) {
  await page.goto('/login')
  await page.locator('input[name="email"]').waitFor({ state: 'visible', timeout: 30000 })
  await page.locator('input[name="email"]').fill(ADMIN_EMAIL)
  await page.locator('input[name="password"]').fill(ADMIN_PASSWORD)
  await page.getByRole('button', { name: 'Sign In' }).click()
  await page.waitForURL(/\/admin/, { timeout: 30000 })
}

/**
 * Navigate to an admin route (requires an authenticated session).
 */
async function gotoAdminPage(page, path) {
  await page.goto(path)
  await page.waitForLoadState('networkidle')
}

module.exports = {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  loginAsAdmin,
  gotoAdminPage,
}
