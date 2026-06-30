import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { withDatabaseFallback } from '@/lib/db/fallback'
import {
  postRepository,
  tagRepository,
  categoryRepository,
  authorRepository,
  projectRepository,
  experienceRepository,
  githubCacheRepository,
} from '@/repositories'
import type { PostCore, GitHubRepo, ProjectItem, ExperienceItem, CategoryItem } from '@/types/post'

const isProduction = process.env.NODE_ENV === 'production'

export const getPublishedPosts = cache(async (): Promise<PostCore[]> => {
  return withDatabaseFallback(() => postRepository.findAllPublished(), [])
})

export const getAllPosts = cache(async (): Promise<PostCore[]> => {
  return withDatabaseFallback(
    () =>
      isProduction ? postRepository.findAllPublished() : postRepository.findAllIncludingDrafts(),
    []
  )
})

export function sortPosts(posts: PostCore[]): PostCore[] {
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function coreContent<T extends PostCore>(post: T): Omit<T, 'body'> {
  const { ...rest } = post
  return rest
}

export const getPostBySlug = cache(async (slug: string) => {
  return withDatabaseFallback(() => postRepository.findBySlug(slug), null)
})

export const getPostsByTag = cache(async (tagSlug: string) => {
  return withDatabaseFallback(() => postRepository.findByTagSlug(tagSlug), [])
})

export const getPostsByCategory = cache(async (categorySlug: string) => {
  return withDatabaseFallback(() => postRepository.findByCategorySlug(categorySlug), [])
})

export const getPostsByAuthor = cache(async (authorSlug: string) => {
  return withDatabaseFallback(() => postRepository.findByAuthorSlug(authorSlug), [])
})

export const searchPosts = cache(async (query: string) => {
  return withDatabaseFallback(() => postRepository.searchPublished(query), [])
})

export const getRelatedPosts = cache(async (slug: string) => {
  return withDatabaseFallback(() => postRepository.findRelated(slug), [])
})

export const getCategoryBySlug = cache(async (slug: string) => {
  return withDatabaseFallback(() => categoryRepository.findBySlug(slug), null)
})

export const getCategoriesWithCounts = cache(async (): Promise<CategoryItem[]> => {
  return withDatabaseFallback(() => categoryRepository.findAllWithCounts(), [])
})

export const getAuthorsWithPosts = cache(async () => {
  return withDatabaseFallback(() => authorRepository.findAllWithPosts(), [])
})

export const getRecentPosts = cache(async (limit = 5) => {
  const posts = await getPublishedPosts()
  return sortPosts(posts).slice(0, limit)
})

export const getPopularPosts = cache(async (limit = 5) => {
  const posts = await getPublishedPosts()
  return sortPosts(posts).slice(0, limit)
})

export const getTagCounts = cache(async () => {
  return withDatabaseFallback(() => tagRepository.getCounts(), {})
})

export const getPostAuthors = cache(async (slug: string) => {
  return withDatabaseFallback(() => postRepository.findAuthorsByPostSlug(slug), [])
})

export const getAuthorBySlug = cache(async (slug: string) => {
  return withDatabaseFallback(() => authorRepository.findBySlug(slug), null)
})

export const getProjects = cache(async (): Promise<ProjectItem[]> => {
  const projects = await withDatabaseFallback(() => projectRepository.findAll(), [])
  return projects.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    imgSrc: p.imgSrc,
    href: p.href,
  }))
})

export const getExperience = cache(async (): Promise<ExperienceItem[]> => {
  const items = await withDatabaseFallback(() => experienceRepository.findAll(), [])
  return items.map((e) => ({
    id: e.id,
    title: e.title,
    company: e.company,
    location: e.location,
    range: e.range,
    url: e.url,
    text: e.text as string[],
  }))
})

const CACHE_DURATION_MS = 24 * 60 * 60 * 1000

async function fetchGitHubReposFromApi(): Promise<GitHubRepo[]> {
  const response = await fetch(
    'https://api.github.com/users/turahe/repos?sort=updated&per_page=100',
    {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'Wach-Blog-Portfolio',
      },
      next: { revalidate: 3600 },
    }
  )

  if (!response.ok) {
    throw new Error(`GitHub API responded with status: ${response.status}`)
  }

  const repos = await response.json()

  return repos
    .filter(
      (repo: GitHubRepo & { fork?: boolean; private?: boolean }) => !repo.fork && !repo.private
    )
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
}

export const getGitHubRepos = unstable_cache(
  async (): Promise<GitHubRepo[]> => {
    try {
      const cached = await withDatabaseFallback(() => githubCacheRepository.get(), null)
      if (cached && Date.now() - cached.fetchedAt.getTime() < CACHE_DURATION_MS) {
        return cached.data as GitHubRepo[]
      }

      const repos = await fetchGitHubReposFromApi()
      await withDatabaseFallback(() => githubCacheRepository.set(repos), undefined)
      return repos
    } catch (error) {
      console.error('Error fetching GitHub repositories:', error)
      const cached = await withDatabaseFallback(() => githubCacheRepository.get(), null)
      if (cached) {
        return cached.data as GitHubRepo[]
      }
      return []
    }
  },
  ['github-repos'],
  { revalidate: 3600, tags: ['github-repos'] }
)
