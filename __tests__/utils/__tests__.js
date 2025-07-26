import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'

describe('Site Metadata', () => {
  test('should have required fields', () => {
    expect(siteMetadata).toHaveProperty('title')
    expect(siteMetadata).toHaveProperty('author')
    expect(siteMetadata).toHaveProperty('description')
    expect(siteMetadata).toHaveProperty('siteUrl')
    expect(siteMetadata).toHaveProperty('language')
  })

  test('should have valid title', () => {
    expect(typeof siteMetadata.title).toBe('string')
    expect(siteMetadata.title.length).toBeGreaterThan(0)
  })

  test('should have valid author', () => {
    expect(typeof siteMetadata.author).toBe('string')
    expect(siteMetadata.author.length).toBeGreaterThan(0)
  })

  test('should have valid description', () => {
    expect(typeof siteMetadata.description).toBe('string')
    expect(siteMetadata.description.length).toBeGreaterThan(0)
  })

  test('should have valid site URL', () => {
    expect(typeof siteMetadata.siteUrl).toBe('string')
    expect(siteMetadata.siteUrl).toMatch(/^https?:\/\//)
  })

  test('should have valid social links', () => {
    if (siteMetadata.github) {
      expect(siteMetadata.github).toMatch(/^https?:\/\//)
    }
    if (siteMetadata.twitter) {
      expect(siteMetadata.twitter).toMatch(/^https?:\/\//)
    }
    if (siteMetadata.linkedin) {
      expect(siteMetadata.linkedin).toMatch(/^https?:\/\//)
    }
  })

  test('should have valid analytics configuration', () => {
    expect(siteMetadata).toHaveProperty('analytics')
    expect(typeof siteMetadata.analytics).toBe('object')
  })

  test('should have valid comments configuration', () => {
    expect(siteMetadata).toHaveProperty('comments')
    expect(typeof siteMetadata.comments).toBe('object')
  })

  test('should have valid search configuration', () => {
    expect(siteMetadata).toHaveProperty('search')
    expect(typeof siteMetadata.search).toBe('object')
  })
})

describe('Header Navigation Links', () => {
  test('should be an array', () => {
    expect(Array.isArray(headerNavLinks)).toBe(true)
  })

  test('should have at least one link', () => {
    expect(headerNavLinks.length).toBeGreaterThan(0)
  })

  test('each link should have required properties', () => {
    headerNavLinks.forEach((link) => {
      expect(link).toHaveProperty('title')
      expect(link).toHaveProperty('href')
      expect(typeof link.title).toBe('string')
      expect(typeof link.href).toBe('string')
    })
  })

  test('each link should have valid href', () => {
    headerNavLinks.forEach((link) => {
      expect(link.href).toMatch(/^\/|^https?:\/\//)
    })
  })

  test('should not have duplicate titles', () => {
    const titles = headerNavLinks.map((link) => link.title)
    const uniqueTitles = [...new Set(titles)]
    expect(titles.length).toBe(uniqueTitles.length)
  })
})

describe('URL Validation', () => {
  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  test('should validate external URLs', () => {
    const externalUrls = [
      siteMetadata.github,
      siteMetadata.twitter,
      siteMetadata.linkedin,
      siteMetadata.facebook,
      siteMetadata.youtube,
    ].filter(Boolean)

    externalUrls.forEach((url) => {
      expect(isValidUrl(url)).toBe(true)
    })
  })

  test('should validate site URL', () => {
    expect(isValidUrl(siteMetadata.siteUrl)).toBe(true)
  })
})

describe('Email Validation', () => {
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  test('should have valid email format', () => {
    if (siteMetadata.email) {
      expect(isValidEmail(siteMetadata.email)).toBe(true)
    }
  })
}) 