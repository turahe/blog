#!/usr/bin/env node

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

import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const LICENSE_HEADER = `/**
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

`

const EXCLUDED_DIRS = [
  'node_modules',
  '.next',
  'out',
  'dist',
  'build',
  '.git',
  'playwright-report',
  'test-results',
  'coverage',
  '.yarn',
]

const INCLUDED_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.mjs']

async function isBinaryFile(filePath) {
  try {
    const buffer = await fs.readFile(filePath)
    // Check for null bytes or other binary indicators
    for (let i = 0; i < Math.min(buffer.length, 1024); i++) {
      if (buffer[i] === 0) {
        return true
      }
    }
    return false
  } catch (error) {
    return false
  }
}

async function addLicenseHeader(filePath) {
  try {
    // Skip binary files
    if (await isBinaryFile(filePath)) {
      console.log(`⏭️  Skipped (binary file): ${filePath}`)
      return
    }

    const content = await fs.readFile(filePath, 'utf-8')

    // Skip if already has license header
    if (content.includes('PROPRIETARY LICENSE') || content.includes('@license PROPRIETARY')) {
      console.log(`⏭️  Skipped (already licensed): ${filePath}`)
      return
    }

    // Add license header
    const newContent = LICENSE_HEADER + content
    await fs.writeFile(filePath, newContent, 'utf-8')
    console.log(`✅ Added license header: ${filePath}`)
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message)
  }
}

async function processDirectory(dirPath) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name)

      if (entry.isDirectory()) {
        if (!EXCLUDED_DIRS.includes(entry.name)) {
          await processDirectory(fullPath)
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name)
        if (INCLUDED_EXTENSIONS.includes(ext)) {
          await addLicenseHeader(fullPath)
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error reading directory ${dirPath}:`, error.message)
  }
}

async function main() {
  console.log('🔒 Adding proprietary license headers to source files...\n')

  const projectRoot = path.join(__dirname, '..')
  await processDirectory(projectRoot)

  console.log('\n✅ License header addition completed!')
  console.log('📝 Remember to review and commit the changes.')
}

main().catch(console.error)
