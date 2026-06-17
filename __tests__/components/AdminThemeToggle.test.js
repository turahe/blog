const React = require('react')
const { render, screen, fireEvent } = require('@testing-library/react')
const { AdminThemeToggle } = require('@/components/admin/header/AdminThemeToggle')

const setTheme = jest.fn()

jest.mock('@/lib/theme/theme-provider', () => ({
  useTheme: jest.fn(() => ({
    theme: 'light',
    setTheme,
    resolvedTheme: 'light',
  })),
}))

describe('AdminThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders moon icon in light mode', () => {
    render(React.createElement(AdminThemeToggle))
    expect(screen.getByRole('button', { name: 'Switch to dark mode' })).toBeInTheDocument()
  })

  test('switches to dark mode on click', () => {
    render(React.createElement(AdminThemeToggle))
    fireEvent.click(screen.getByRole('button', { name: 'Switch to dark mode' }))
    expect(setTheme).toHaveBeenCalledWith('dark')
  })

  test('switches to light mode when already dark', () => {
    const { useTheme } = require('@/lib/theme/theme-provider')
    useTheme.mockReturnValue({
      theme: 'dark',
      setTheme,
      resolvedTheme: 'dark',
    })

    render(React.createElement(AdminThemeToggle))
    fireEvent.click(screen.getByRole('button', { name: 'Switch to light mode' }))
    expect(setTheme).toHaveBeenCalledWith('light')
  })
})
