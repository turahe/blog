const { escape } = require('@/lib/htmlEscaper')

describe('htmlEscaper', () => {
  test('escapes HTML entities', () => {
    expect(escape('<div>"test" & \'ok\'</div>')).toBe(
      '&lt;div&gt;&quot;test&quot; &amp; &#39;ok&#39;&lt;/div&gt;'
    )
  })
})
