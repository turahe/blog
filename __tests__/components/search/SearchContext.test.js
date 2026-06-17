const React = require('react')
const { render, screen, fireEvent } = require('@testing-library/react')
const { SearchContextProvider, useSearch } = require('@/components/search/SearchContext')

function Probe() {
  const { open, toggle } = useSearch()
  return React.createElement(
    'button',
    { type: 'button', onClick: toggle },
    open ? 'open' : 'closed'
  )
}

describe('SearchContext', () => {
  test('throws outside provider', () => {
    const Broken = () => {
      useSearch()
      return null
    }

    expect(() => render(React.createElement(Broken))).toThrow(
      'useSearch must be used within SearchContextProvider'
    )
  })

  test('toggles open state', () => {
    render(React.createElement(SearchContextProvider, null, React.createElement(Probe)))

    expect(screen.getByRole('button', { name: 'closed' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'closed' }))
    expect(screen.getByRole('button', { name: 'open' })).toBeInTheDocument()
  })
})
