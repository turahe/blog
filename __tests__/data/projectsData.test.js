import projectsData from '@/data/projectsData'

describe('Projects Data', () => {
  test('should be an array', () => {
    expect(Array.isArray(projectsData)).toBe(true)
  })

  test('each project should have required properties', () => {
    projectsData.forEach((project) => {
      expect(project).toHaveProperty('title')
      expect(project).toHaveProperty('description')
      expect(project).toHaveProperty('imgSrc')
      expect(project).toHaveProperty('href')
      
      expect(typeof project.title).toBe('string')
      expect(typeof project.description).toBe('string')
      expect(typeof project.imgSrc).toBe('string')
      expect(typeof project.href).toBe('string')
    })
  })

  test('project titles should not be empty', () => {
    projectsData.forEach((project) => {
      expect(project.title.trim().length).toBeGreaterThan(0)
    })
  })

  test('project descriptions should not be empty', () => {
    projectsData.forEach((project) => {
      expect(project.description.trim().length).toBeGreaterThan(0)
    })
  })

  test('project images should have valid paths', () => {
    projectsData.forEach((project) => {
      expect(project.imgSrc).toMatch(/^\/static\/images\/.*\.(png|jpg|jpeg|gif|webp|svg)$/i)
    })
  })

  test('project links should be valid URLs', () => {
    const isValidUrl = (string) => {
      try {
        new URL(string)
        return true
      } catch (_) {
        return false
      }
    }

    projectsData.forEach((project) => {
      expect(isValidUrl(project.href)).toBe(true)
    })
  })

  test('should not have duplicate titles', () => {
    const titles = projectsData.map((project) => project.title)
    const uniqueTitles = [...new Set(titles)]
    expect(titles.length).toBe(uniqueTitles.length)
  })

  test('should not have duplicate URLs', () => {
    const urls = projectsData.map((project) => project.href)
    const uniqueUrls = [...new Set(urls)]
    expect(urls.length).toBe(uniqueUrls.length)
  })

  test('project titles should be reasonable length', () => {
    projectsData.forEach((project) => {
      expect(project.title.length).toBeLessThanOrEqual(100)
      expect(project.title.length).toBeGreaterThan(0)
    })
  })

  test('project descriptions should be reasonable length', () => {
    projectsData.forEach((project) => {
      expect(project.description.length).toBeLessThanOrEqual(500)
      expect(project.description.length).toBeGreaterThan(0)
    })
  })
}) 