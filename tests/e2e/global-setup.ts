import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use

  // Launch browser and create a new context
  const browser = await chromium.launch()
  const context = await browser.newContext()

  // Create a new page
  const page = await context.newPage()

  // Navigate to the base URL to ensure the app is running
  await page.goto(baseURL || 'http://localhost:3000')

  // Wait for the page to load completely
  await page.waitForLoadState('networkidle')

  // Verify the page is accessible
  const title = await page.title()
  console.log(`✅ Application is running. Page title: ${title}`)

  // Close browser
  await browser.close()
}

export default globalSetup 