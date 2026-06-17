const React = require('react')
const { render, screen, fireEvent } = require('@testing-library/react')

jest.unmock('@/components/search/SearchTrigger')

const { SearchContextProvider } = require('@/components/search/SearchContext')
const { SearchTrigger } = require('@/components/search/SearchTrigger')
const { CommandPalette } = require('@/components/search/CommandPalette')

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

function SearchTestApp({ children }) {
  return React.createElement(
    SearchContextProvider,
    null,
    React.createElement(CommandPalette, { items: [], isLoading: false }),
    children
  )
}

describe('SearchTrigger', () => {
  test('opens command palette when clicked', () => {
    render(
      React.createElement(
        SearchTestApp,
        null,
        React.createElement(SearchTrigger, { 'aria-label': 'Search' }, 'Open search')
      )
    )

    expect(screen.queryByPlaceholderText('Search articles...')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Search' }))
    expect(screen.getByPlaceholderText('Search articles...')).toBeInTheDocument()
  })
})
