const React = require('react')
const { render } = require('@testing-library/react')
const { Skeleton, TableSkeleton, CardSkeleton } = require('@/components/admin/Skeleton')

describe('Skeleton', () => {
  test('renders with admin-skeleton class', () => {
    const { container } = render(React.createElement(Skeleton))
    expect(container.firstChild).toHaveClass('admin-skeleton')
  })

  test('TableSkeleton renders requested row count', () => {
    const { container } = render(React.createElement(TableSkeleton, { rows: 3 }))
    expect(container.querySelectorAll('.admin-skeleton')).toHaveLength(4)
  })

  test('CardSkeleton renders placeholder blocks', () => {
    const { container } = render(React.createElement(CardSkeleton))
    expect(container.querySelectorAll('.admin-skeleton')).toHaveLength(2)
  })
})
