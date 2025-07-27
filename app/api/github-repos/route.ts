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

import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const CACHE_FILE = path.join(process.cwd(), 'data', 'github-repos-cache.json')
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  topics: string[]
  default_branch: string
  fork: boolean
  private: boolean
}

interface CachedData {
  timestamp: number
  data: GitHubRepo[]
}

async function readCache(): Promise<CachedData | null> {
  try {
    const cacheData = await fs.readFile(CACHE_FILE, 'utf-8')
    const parsed: CachedData = JSON.parse(cacheData)

    // Check if cache is still valid
    if (Date.now() - parsed.timestamp < CACHE_DURATION) {
      console.log('Serving GitHub repos from cache')
      return parsed
    }
  } catch (error) {
    // Cache file doesn't exist or is invalid
    console.log('No valid cache found, fetching fresh data')
  }
  return null
}

async function writeCache(data: GitHubRepo[]): Promise<void> {
  try {
    // Ensure the data directory exists
    const dataDir = path.dirname(CACHE_FILE)
    await fs.mkdir(dataDir, { recursive: true })

    const cacheData: CachedData = {
      timestamp: Date.now(),
      data,
    }

    await fs.writeFile(CACHE_FILE, JSON.stringify(cacheData, null, 2))
    console.log('GitHub repos cached successfully')
  } catch (error) {
    console.error('Failed to write cache:', error)
  }
}

export async function GET() {
  try {
    // Try to serve from cache first
    const cached = await readCache()
    if (cached) {
      return NextResponse.json(cached.data)
    }

    // Fetch fresh data from GitHub API
    console.log('Fetching fresh GitHub repos data')
    const response = await fetch(
      'https://api.github.com/users/turahe/repos?sort=updated&per_page=100',
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'Wach-Blog-Portfolio',
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    )

    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`)
    }

    const repos = await response.json()

    // Filter and transform repositories
    const filteredRepos = repos
      .filter((repo: GitHubRepo) => !repo.fork && !repo.private)
      .map((repo: GitHubRepo) => ({
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
      .sort((a: GitHubRepo, b: GitHubRepo) => b.stargazers_count - a.stargazers_count)

    // Cache the filtered data
    await writeCache(filteredRepos)

    return NextResponse.json(filteredRepos)
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error)

    // Try to serve from cache even if it's expired as fallback
    try {
      const fallbackCache = await readCache()
      if (fallbackCache) {
        console.log('Serving expired cache as fallback')
        return NextResponse.json(fallbackCache.data)
      }
    } catch (cacheError) {
      console.error('Failed to read fallback cache:', cacheError)
    }

    return NextResponse.json({ error: 'Failed to fetch repositories' }, { status: 500 })
  }
}
