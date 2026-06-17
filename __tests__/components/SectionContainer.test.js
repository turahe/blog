const React = require('react')
const { render, screen } = require('@testing-library/react')
const SectionContainer = require('@/components/SectionContainer').default

describe('SectionContainer', () => {
  test('renders children inside a section', () => {
    render(
      React.createElement(SectionContainer, null, React.createElement('p', null, 'Section content'))
    )
    expect(screen.getByText('Section content').closest('section')).toBeInTheDocument()
  })
})
