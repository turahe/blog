const React = require('react')
const { render, screen } = require('@testing-library/react')
const Tag = require('@/components/Tag').default

describe('Tag', () => {
  test('links to slugified tag page', () => {
    render(React.createElement(Tag, { text: 'Next.js' }))
    expect(screen.getByRole('link', { name: 'Next.js' })).toHaveAttribute('href', '/tags/nextjs')
  })

  test('replaces spaces with hyphens in label', () => {
    render(React.createElement(Tag, { text: 'web dev' }))
    expect(screen.getByRole('link', { name: 'web-dev' })).toHaveAttribute('href', '/tags/web-dev')
  })
})
