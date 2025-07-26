// Test utilities for common testing patterns

export const createMockPost = (overrides = {}) => {
  return {
    title: 'Test Post',
    date: '2024-01-01',
    lastmod: '2024-01-15',
    tags: ['test', 'example'],
    draft: false,
    summary: 'This is a test post summary',
    images: ['/static/images/test.jpg'],
    authors: ['default'],
    layout: 'PostLayout',
    canonicalUrl: 'https://wach.id/blog/test-post',
    ...overrides,
  }
}

export const createMockProject = (overrides = {}) => {
  return {
    title: 'Test Project',
    description: 'This is a test project description',
    imgSrc: '/static/images/project.jpg',
    href: 'https://example.com',
    ...overrides,
  }
}

export const createMockExperience = (overrides = {}) => {
  return {
    title: 'Software Engineer',
    company: 'Test Company',
    location: 'Remote',
    range: '2020 - Present',
    url: 'https://example.com',
    text: 'This is a test experience description',
    ...overrides,
  }
}

export const mockSiteMetadata = {
  title: 'Test Blog',
  author: 'Test Author',
  headerTitle: 'Test',
  description: 'Test blog description',
  language: 'en-us',
  theme: 'system',
  siteUrl: 'https://test.com',
  siteRepo: 'https://github.com/test/blog',
  siteLogo: '/static/images/logo.png',
  socialBanner: '/static/images/twitter-card.png',
  email: 'test@example.com',
  github: 'https://github.com/test',
  twitter: 'https://twitter.com/test',
  facebook: 'https://facebook.com/test',
  youtube: 'https://youtube.com/test',
  linkedin: 'https://linkedin.com/in/test',
  locale: 'en-US',
  analytics: {
    umamiAnalytics: {
      umamiWebsiteId: 'test-id',
      src: 'https://test.com/script.js',
    },
  },
  newsletter: {
    provider: 'mailchimp',
  },
  comments: {
    provider: 'giscus',
    giscusConfig: {
      repo: 'test/repo',
      repositoryId: 'test-repo-id',
      category: 'test-category',
      categoryId: 'test-category-id',
      mapping: 'pathname',
      reactions: '1',
      metadata: '0',
      theme: 'light',
      darkTheme: 'transparent_dark',
      themeURL: '',
      lang: 'en',
    },
  },
  search: {
    provider: 'kbar',
    kbarConfig: {
      searchDocumentsPath: 'search.json',
    },
  },
}

export const mockHeaderNavLinks = [
  { title: 'Home', href: '/' },
  { title: 'Blog', href: '/blog' },
  { title: 'About', href: '/about' },
  { title: 'Projects', href: '/projects' },
  { title: 'Tags', href: '/tags' },
]

// Test data validation helpers
export const validatePostStructure = (post) => {
  const requiredFields = ['title', 'date', 'tags', 'draft', 'summary']
  return requiredFields.every(field => post.hasOwnProperty(field))
}

export const validateProjectStructure = (project) => {
  const requiredFields = ['title', 'description', 'imgSrc', 'href']
  return requiredFields.every(field => project.hasOwnProperty(field))
}

export const validateExperienceStructure = (experience) => {
  const requiredFields = ['title', 'company', 'location', 'range', 'url', 'text']
  return requiredFields.every(field => experience.hasOwnProperty(field))
}

// Mock functions for testing
export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
}

export const mockPathname = '/'

export const mockSearchParams = new URLSearchParams()

// Test environment setup
export const setupTestEnvironment = () => {
  // Mock localStorage
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  }
  global.localStorage = localStorageMock

  // Mock sessionStorage
  const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  }
  global.sessionStorage = sessionStorageMock

  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}

export const cleanupTestEnvironment = () => {
  jest.clearAllMocks()
} 