const React = require('react')
const { render, screen } = require('@testing-library/react')
const { SaveIndicator } = require('@/components/admin/settings/SaveIndicator')

describe('SaveIndicator', () => {
  test.each([
    ['saving', 'Saving…'],
    ['saved', 'All changes saved'],
    ['error', 'Save failed'],
  ])('shows %s status label', (status, label) => {
    render(React.createElement(SaveIndicator, { status }))
    expect(screen.getByText(label)).toBeInTheDocument()
  })

  test('shows unsaved changes when dirty', () => {
    render(React.createElement(SaveIndicator, { status: 'idle', dirty: true }))
    expect(screen.getByText('Unsaved changes')).toBeInTheDocument()
  })

  test('shows up to date when idle and clean', () => {
    render(React.createElement(SaveIndicator, { status: 'idle', dirty: false }))
    expect(screen.getByText('Up to date')).toBeInTheDocument()
  })
})
