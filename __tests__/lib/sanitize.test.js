const { escapeHtml, sanitizeString, sanitizeEmail } = require('@/lib/security/sanitize')

describe('escapeHtml', () => {
  test('escapes HTML special characters', () => {
    expect(escapeHtml(`<script>"alert('xss')"</script>`)).toBe(
      '&lt;script&gt;&quot;alert(&#39;xss&#39;)&quot;&lt;/script&gt;'
    )
  })
})

describe('sanitizeString', () => {
  test('trims, escapes, and limits length', () => {
    const input = `  hello ${'x'.repeat(1005)}  `
    const result = sanitizeString(input, 1000)
    expect(result).not.toContain('<')
    expect(result.startsWith('hello')).toBe(true)
    expect(result.length).toBeLessThanOrEqual(1000)
  })
})

describe('sanitizeEmail', () => {
  test('normalizes email', () => {
    expect(sanitizeEmail('  Admin@Example.COM  ')).toBe('admin@example.com')
  })
})
