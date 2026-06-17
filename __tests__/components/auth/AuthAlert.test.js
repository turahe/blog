const React = require('react')
const { render, screen } = require('@testing-library/react')
const { AuthAlert } = require('@/components/auth/AuthAlert')

describe('AuthAlert', () => {
  test('renders error alert by default', () => {
    render(React.createElement(AuthAlert, { message: 'Invalid credentials' }))
    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Invalid credentials')
  })

  test('renders title and success variant', () => {
    render(
      React.createElement(AuthAlert, {
        title: 'Success',
        message: 'Password updated',
        variant: 'success',
      })
    )

    expect(screen.getByText('Success')).toBeInTheDocument()
    expect(screen.getByText('Password updated')).toBeInTheDocument()
  })
})
