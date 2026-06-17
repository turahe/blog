const React = require('react')
const { render, screen } = require('@testing-library/react')
const userEvent = require('@testing-library/user-event').default
const { AuthButton } = require('@/components/auth/AuthButton')

describe('AuthButton', () => {
  test('renders children when idle', () => {
    render(React.createElement(AuthButton, null, 'Sign In'))
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeEnabled()
  })

  test('shows loading text and disables when loading', () => {
    render(
      React.createElement(AuthButton, { loading: true, loadingText: 'Signing in…' }, 'Sign In')
    )
    const button = screen.getByRole('button', { name: 'Signing in…' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
  })

  test('forwards click handler', async () => {
    const onClick = jest.fn()
    render(React.createElement(AuthButton, { onClick, type: 'button' }, 'Continue'))
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
