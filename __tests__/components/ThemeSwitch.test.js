const React = require('react')
const { render, screen, fireEvent, waitFor } = require('@testing-library/react')
const ThemeSwitch = require('@/components/ThemeSwitch').default
const { ThemeProvider } = require('@/lib/theme/theme-provider')

describe('ThemeSwitch', () => {
  test('renders toggle button after mount', async () => {
    render(
      React.createElement(
        ThemeProvider,
        { defaultTheme: 'light' },
        React.createElement(ThemeSwitch)
      )
    )

    const button = await screen.findByRole('button', { name: 'Toggle Dark Mode' })
    expect(button).toBeInTheDocument()
    fireEvent.click(button)
  })
})
