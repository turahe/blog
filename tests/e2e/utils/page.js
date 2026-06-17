/**
 * Shared Playwright page helpers for E2E tests.
 */

async function waitForPageReady(page) {
  await page.waitForLoadState('domcontentloaded')
}

function siteHeader(page) {
  return page.locator('header.flex.items-center.justify-between')
}

function siteMain(page) {
  return page.locator('main.mb-auto')
}

function homeLogoLink(page) {
  return siteHeader(page).locator('a[href="/"]').first()
}

function mobileMenuButton(page) {
  return page.getByRole('button', { name: 'Toggle Menu' }).first()
}

function loginEmailInput(page) {
  return page.getByRole('textbox', { name: 'Email' })
}

function loginPasswordInput(page) {
  return page.locator('input[name="password"]')
}

module.exports = {
  waitForPageReady,
  siteHeader,
  siteMain,
  homeLogoLink,
  mobileMenuButton,
  loginEmailInput,
  loginPasswordInput,
}
