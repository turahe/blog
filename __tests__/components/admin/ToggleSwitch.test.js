const React = require('react')
const { render, screen, fireEvent } = require('@testing-library/react')
const { ToggleSwitch } = require('@/components/admin/settings/ToggleSwitch')

describe('ToggleSwitch', () => {
  test('renders label and description', () => {
    render(
      React.createElement(ToggleSwitch, {
        label: 'Enable feature',
        description: 'Optional helper text',
        checked: false,
        onChange: jest.fn(),
      })
    )

    expect(screen.getByText('Enable feature')).toBeInTheDocument()
    expect(screen.getByText('Optional helper text')).toBeInTheDocument()
  })

  test('calls onChange when toggled', () => {
    const onChange = jest.fn()
    render(
      React.createElement(ToggleSwitch, {
        label: 'Dark sidebar',
        checked: false,
        onChange,
      })
    )

    fireEvent.click(screen.getByRole('checkbox'))
    expect(onChange).toHaveBeenCalledWith(true)
  })
})
