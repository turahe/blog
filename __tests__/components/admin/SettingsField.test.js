const React = require('react')
const { render, screen } = require('@testing-library/react')
const { SettingsField } = require('@/components/admin/settings/SettingsField')

describe('SettingsField', () => {
  test('renders label, hint, and children', () => {
    render(
      React.createElement(
        SettingsField,
        { label: 'Site title', hint: 'Shown in the header' },
        React.createElement('input', { id: 'site-title' })
      )
    )

    expect(screen.getByText('Site title')).toBeInTheDocument()
    expect(screen.getByText('Shown in the header')).toBeInTheDocument()
  })

  test('shows error instead of hint', () => {
    render(
      React.createElement(
        SettingsField,
        { label: 'Email', error: 'Invalid email' },
        React.createElement('input', null)
      )
    )

    expect(screen.getByText('Invalid email')).toBeInTheDocument()
    expect(screen.queryByText('Shown in the header')).not.toBeInTheDocument()
  })
})
