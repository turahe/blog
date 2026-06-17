const React = require('react')
const { render, screen } = require('@testing-library/react')
const { StatCard } = require('@/components/admin/StatCard')

describe('StatCard', () => {
  test('renders label and value', () => {
    render(React.createElement(StatCard, { label: 'Total Users', value: 42 }))
    expect(screen.getByText('Total Users')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  test('renders optional trend and icon', () => {
    render(
      React.createElement(StatCard, {
        label: 'Posts',
        value: '12',
        trend: '+3 this week',
        icon: React.createElement('span', null, '★'),
      })
    )
    expect(screen.getByText('+3 this week')).toBeInTheDocument()
    expect(screen.getByText('★')).toBeInTheDocument()
  })
})
