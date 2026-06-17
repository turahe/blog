const React = require('react')
const { render, screen } = require('@testing-library/react')
const PageTitle = require('@/components/PageTitle').default

describe('PageTitle', () => {
  test('renders children as heading', () => {
    render(React.createElement(PageTitle, null, 'About Me'))
    expect(screen.getByRole('heading', { level: 1, name: 'About Me' })).toBeInTheDocument()
  })
})
