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

import Link from './Link'

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
}

const GitHubCard = ({ repo }: { repo: GitHubRepo }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      JavaScript: 'bg-yellow-400',
      TypeScript: 'bg-blue-600',
      PHP: 'bg-purple-500',
      Python: 'bg-green-500',
      Java: 'bg-red-500',
      'C++': 'bg-pink-500',
      'C#': 'bg-green-600',
      Go: 'bg-cyan-500',
      Rust: 'bg-orange-500',
      Ruby: 'bg-red-600',
      Swift: 'bg-orange-400',
      Kotlin: 'bg-purple-600',
      Dart: 'bg-blue-500',
      HTML: 'bg-orange-600',
      CSS: 'bg-blue-400',
      Shell: 'bg-green-400',
      Dockerfile: 'bg-blue-500',
      Vue: 'bg-green-400',
      React: 'bg-blue-500',
      Laravel: 'bg-red-500',
    }
    return colors[language] || 'bg-gray-500'
  }

  return (
    <div className="md max-w-[544px] p-4 md:w-1/2">
      <div className="border-opacity-60 h-full overflow-hidden rounded-md border-2 border-gray-200 transition-colors hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600">
        <div className="p-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-2xl leading-8 font-bold tracking-tight">
              <Link href={repo.html_url} aria-label={`Link to ${repo.name}`}>
                {repo.name}
              </Link>
            </h2>
            <div className="flex items-center space-x-2">
              {repo.language && (
                <div className="flex items-center space-x-1">
                  <div className={`h-3 w-3 rounded-full ${getLanguageColor(repo.language)}`}></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{repo.language}</span>
                </div>
              )}
            </div>
          </div>

          {repo.description && (
            <p className="prose mb-4 max-w-none text-gray-500 dark:text-gray-400">
              {repo.description}
            </p>
          )}

          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <span>⭐</span>
                <span>{repo.stargazers_count}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>🔀</span>
                <span>{repo.forks_count}</span>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Updated {formatDate(repo.updated_at)}
            </div>
          </div>

          {repo.topics && repo.topics.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {repo.topics.slice(0, 5).map((topic) => (
                <span
                  key={topic}
                  className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  {topic}
                </span>
              ))}
              {repo.topics.length > 5 && (
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  +{repo.topics.length - 5} more
                </span>
              )}
            </div>
          )}

          <div className="flex space-x-3">
            <Link
              href={repo.html_url}
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-base leading-6 font-medium"
              aria-label={`View ${repo.name} on GitHub`}
            >
              View on GitHub &rarr;
            </Link>
            {repo.homepage && (
              <Link
                href={repo.homepage}
                className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-base leading-6 font-medium"
                aria-label={`Visit ${repo.name} homepage`}
              >
                Live Demo &rarr;
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GitHubCard
