const { slugify, createSlugger } = require('@/lib/slug')

describe('slugify', () => {
  test('lowercases and hyphenates words', () => {
    expect(slugify('Hello World')).toBe('hello-world')
    expect(slugify('web dev')).toBe('web-dev')
  })

  test('removes punctuation', () => {
    expect(slugify('Next.js')).toBe('nextjs')
    expect(slugify('Special@Characters!')).toBe('specialcharacters')
    expect(slugify('Test (with) brackets')).toBe('test-with-brackets')
  })

  test('handles empty input', () => {
    expect(slugify('')).toBe('')
  })
})

describe('createSlugger', () => {
  test('deduplicates repeated headings', () => {
    const slugger = createSlugger()
    expect(slugger.slug('Dup')).toBe('dup')
    expect(slugger.slug('Dup')).toBe('dup-1')
  })
})
