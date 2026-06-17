const React = require('react')
const { render, screen } = require('@testing-library/react')
const { AuthCard } = require('@/components/auth/AuthCard')

describe('AuthCard', () => {
  test('renders children', () => {
    render(React.createElement(AuthCard, null, React.createElement('p', null, 'Login form')))
    expect(screen.getByText('Login form')).toBeInTheDocument()
  })

  test('applies custom className', () => {
    const { container } = render(
      React.createElement(AuthCard, { className: 'max-w-md' }, 'Content')
    )
    expect(container.firstChild).toHaveClass('max-w-md')
  })
})
