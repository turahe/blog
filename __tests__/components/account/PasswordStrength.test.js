const React = require('react')
const { render, screen } = require('@testing-library/react')
const { PasswordStrength } = require('@/components/account/PasswordStrength')

describe('PasswordStrength', () => {
  test('returns null for empty password', () => {
    const { container } = render(React.createElement(PasswordStrength, { password: '' }))
    expect(container).toBeEmptyDOMElement()
  })

  test('shows weak label for short password', () => {
    render(React.createElement(PasswordStrength, { password: 'abc' }))
    expect(screen.getByText('Weak')).toBeInTheDocument()
  })

  test('shows stronger label for complex password', () => {
    render(React.createElement(PasswordStrength, { password: 'Str0ng!Pass12' }))
    expect(screen.getByText('Excellent')).toBeInTheDocument()
  })
})
