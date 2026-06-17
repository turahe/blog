const React = require('react')
const { render, screen, fireEvent } = require('@testing-library/react')
const { ColorPicker } = require('@/components/admin/settings/ColorPicker')

describe('ColorPicker', () => {
  test('updates value from text input', () => {
    const onChange = jest.fn()
    render(
      React.createElement(ColorPicker, {
        label: 'Primary',
        value: '#3366ff',
        onChange,
      })
    )

    const textInput = screen.getByRole('textbox')
    fireEvent.change(textInput, { target: { value: '#ff0000' } })
    expect(onChange).toHaveBeenCalledWith('#ff0000')
  })
})
