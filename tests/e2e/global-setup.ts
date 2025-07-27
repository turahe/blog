/**
 * PROPRIETARY LICENSE
 * 
 * Copyright (c) 2024 Nur Wachid. All rights reserved.
 * 
 * This software and associated documentation files (the "Software") are the 
 * proprietary and confidential information of Nur Wachid ("Licensor"). 
 * The Software is protected by copyright laws and international copyright 
 * treaties, as well as other intellectual property laws and treaties.
 * 
 * RESTRICTIONS:
 * - NO REDISTRIBUTION: You may not redistribute, sell, lease, rent, 
 *   lend, or otherwise transfer the Software to any third party without 
 *   the express written consent of Nur Wachid.
 * - NO MODIFICATION: You may not modify, adapt, alter, translate, or 
 *   create derivative works based on the Software without the express 
 *   written consent of Nur Wachid.
 * - NO REVERSE ENGINEERING: You may not reverse engineer, decompile, 
 *   disassemble, or otherwise attempt to derive the source code of the 
 *   Software.
 * - NO COMMERCIAL USE: You may not use the Software for any commercial 
 *   purpose without the express written consent of Nur Wachid.
 * - PERSONAL USE ONLY: This Software is provided for personal, 
 *   non-commercial use only.
 * 
 * For licensing inquiries, commercial use, or other permissions, please 
 * contact: Nur Wachid (wachid@outlook.com)
 * 
 * @license PROPRIETARY
 * @author Nur Wachid <wachid@outlook.com>
 * @copyright 2024 Nur Wachid. All rights reserved.
 */

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