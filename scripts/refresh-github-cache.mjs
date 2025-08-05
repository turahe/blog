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
const CACHE_FILE = path.join(__dirname, '..', 'cache', 'github-repos-cache.json')

async function refreshCache() {
  try {
    console.log('🔄 Refreshing GitHub repositories cache...')

    // Fetch fresh data from GitHub API
    const response = await fetch(
      'https://api.github.com/users/turahe/repos?sort=updated&per_page=100',
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'Wach-Blog-Portfolio',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`)
    }

    const repos = await response.json()

    // Filter and transform repositories
    const filteredRepos = repos
      .filter((repo) => !repo.fork && !repo.private)
      .map((repo) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        html_url: repo.html_url,
        homepage: repo.homepage,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        updated_at: repo.updated_at,
        topics: repo.topics || [],
        default_branch: repo.default_branch,
      }))
      .sort((a, b) => b.stargazers_count - a.stargazers_count)

    // Ensure the data directory exists
    const dataDir = path.dirname(CACHE_FILE)
    await fs.mkdir(dataDir, { recursive: true })

    // Write cache
    const cacheData = {
      timestamp: Date.now(),
      data: filteredRepos,
    }

    await fs.writeFile(CACHE_FILE, JSON.stringify(cacheData, null, 2))

    console.log(`✅ Cache refreshed successfully!`)
    console.log(`📊 Cached ${filteredRepos.length} repositories`)
    console.log(`📁 Cache file: ${CACHE_FILE}`)
    console.log(`🕐 Cache timestamp: ${new Date(cacheData.timestamp).toISOString()}`)

    // Show top repositories
    console.log('\n🏆 Top repositories by stars:')
    filteredRepos.slice(0, 5).forEach((repo, index) => {
      console.log(`${index + 1}. ${repo.name} (⭐ ${repo.stargazers_count})`)
    })
  } catch (error) {
    console.error('❌ Failed to refresh cache:', error.message)
    process.exit(1)
  }
}

// Run if called directly
refreshCache()

export { refreshCache }
