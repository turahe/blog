import GitHubCard from '@/components/GitHubCard'
import { getGitHubRepos } from '@/services'
import { genPageMetadata } from '@/app/seo'
import type { GitHubRepo } from '@/types/post'

export const metadata = genPageMetadata({ title: 'GitHub Repositories' })
export const revalidate = 3600

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

        <div className="container py-12">
          {githubRepos.length > 0 ? (
            <div className="-m-4 flex flex-wrap">
              {githubRepos.map((repo: GitHubRepo) => (
                <GitHubCard key={repo.id} repo={repo} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">No repositories available.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
