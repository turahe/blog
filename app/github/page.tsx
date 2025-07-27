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
}

export const metadata = genPageMetadata({ title: 'GitHub Repositories' })

async function getGitHubRepos() {
  try {
    // Use absolute URL for server-side rendering
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/github-repos`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      console.error('Failed to fetch GitHub repos:', response.status)
      return []
    }

    return await response.json()
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
