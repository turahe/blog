export interface TocHeading {
  url: string
  text: string
  level: number
}

export interface ReadingTime {
  text: string
  minutes: number
  time: number
  words: number
}

export interface PostCore {
  slug: string
  path: string
  title: string
  date: string
  lastmod?: string
  draft?: boolean
  summary?: string
  tags: string[]
  layout?: string
  music?: string
  images?: string | string[]
  readingTime: ReadingTime
  wordCount?: number
  filePath?: string
  bibliography?: string
  canonicalUrl?: string
}

export interface PostWithBody extends PostCore {
  body: string
  toc: TocHeading[]
  filePath?: string
}

export interface AuthorCore {
  slug: string
  name: string
  avatar?: string
  occupation?: string
  company?: string
  email?: string
  twitter?: string
  bluesky?: string
  linkedin?: string
  github?: string
  layout?: string
}

export interface AuthorWithBody extends AuthorCore {
  body: string
}

export interface PaginationMeta {
  currentPage: number
  totalPages: number
}

export interface GitHubRepo {
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

export interface ProjectItem {
  id: string
  title: string
  description: string
  imgSrc: string
  href: string
}

export interface ExperienceItem {
  id: string
  title: string
  company: string
  location: string
  range: string
  url: string | null
  text: string[]
}
