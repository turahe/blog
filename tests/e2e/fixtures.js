/**
 * Shared Playwright test fixture.
 * Uses domcontentloaded for navigation — the full load event is flaky in Docker CI
 * when analytics/third-party scripts are slow or blocked.
 */
const { test: base, expect } = require('@playwright/test')

const test = base.extend({
  page: async ({ page }, use) => {
    const originalGoto = page.goto.bind(page)
    page.goto = async (url, options = {}) =>
      originalGoto(url, {
        timeout: 60_000,
        ...options,
        waitUntil: options.waitUntil ?? 'domcontentloaded',
      })
    await use(page)
  },
})

module.exports = { test, expect }
