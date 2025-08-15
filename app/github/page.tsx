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

import GitHubCard from '@/components/GitHubCard'
import { genPageMetadata } from 'app/seo'

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
  fork?: boolean
  private?: boolean
}

export const metadata = genPageMetadata({ title: 'GitHub Repositories' })

async function getGitHubRepos() {
  try {
    // Fetch directly from GitHub API during build time
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
      console.error('Failed to fetch GitHub repos:', response.status)
      return []
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

    return filteredRepos
  } catch (error) {
    console.error('Error fetching GitHub repos:', error)
    return []
  }
}

export default async function GitHubRepositories() {
  const githubRepos = await getGitHubRepos()

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            GitHub Repositories
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Explore my open-source projects and contributions on GitHub. These repositories showcase
            my work across various technologies and frameworks.
          </p>
        </div>

        {/* GitHub Repositories */}
        <div className="container py-12">
          {githubRepos.length > 0 ? (
            <div className="-m-4 flex flex-wrap">
              {githubRepos.map((repo: GitHubRepo) => (
                <GitHubCard key={repo.id} repo={repo} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">Loading repositories...</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
