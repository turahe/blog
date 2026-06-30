/**
 * Shared Playwright page helpers for E2E tests.
 */

async function waitForPageReady(page) {
  await page.waitForLoadState('domcontentloaded')
}

async function gotoPath(page, path, options = {}) {
  await page.goto(path, {
    waitUntil: 'domcontentloaded',
    timeout: 60_000,
    ...options,
  })
  await waitForPageReady(page)
}

function siteHeader(page) {
  return page.locator('header.flex.items-center.justify-between')
}

const DESKTOP_NAV_HREFS = {
  Blog: '/blog',
  Search: '/search',
  Tags: '/tags',
  Projects: '/projects',
  GitHub: '/github',
  About: '/about',
}

function desktopNavLinks(page) {
  return siteHeader(page).locator('a.font-medium[href^="/"]')
}

function desktopNavLink(page, name) {
  const href = DESKTOP_NAV_HREFS[name]
  if (!href) {
    throw new Error(`Unknown desktop nav link: ${name}`)
  }
  return siteHeader(page).locator(`a.font-medium[href="${href}"]`)
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
  gotoPath,
  siteHeader,
  desktopNavLinks,
  desktopNavLink,
  siteMain,
  homeLogoLink,
  mobileMenuButton,
  loginEmailInput,
  loginPasswordInput,
}
