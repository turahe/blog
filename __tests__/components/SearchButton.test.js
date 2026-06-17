const React = require('react')
const { render, screen } = require('@testing-library/react')
const SearchButton = require('@/components/SearchButton').default

describe('SearchButton', () => {
  test('renders search trigger when cmdk provider is enabled', () => {
    render(React.createElement(SearchButton))
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument()
  })
})
