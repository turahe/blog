const React = require('react')
const { render } = require('@testing-library/react')

const mockNextImage = jest.fn((props) => React.createElement('img', props))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => mockNextImage(props),
}))

const Image = require('@/components/Image').default

describe('Image', () => {
  beforeEach(() => {
    mockNextImage.mockClear()
  })

  test('passes through default lazy loading', () => {
    render(React.createElement(Image, { src: '/cover.jpg', alt: 'Cover', width: 100, height: 100 }))
    expect(mockNextImage).toHaveBeenCalledWith(
      expect.objectContaining({
        loading: undefined,
        priority: undefined,
        fetchPriority: undefined,
      })
    )
  })

  test('uses eager loading and high fetch priority when priority is set', () => {
    render(
      React.createElement(Image, {
        src: '/hero.jpg',
        alt: 'Hero',
        fill: true,
        priority: true,
      })
    )
    expect(mockNextImage).toHaveBeenCalledWith(
      expect.objectContaining({
        priority: true,
        loading: 'eager',
        fetchPriority: 'high',
      })
    )
  })

  test('respects explicit fetchPriority override', () => {
    render(
      React.createElement(Image, {
        src: '/hero.jpg',
        alt: 'Hero',
        fill: true,
        priority: true,
        fetchPriority: 'low',
      })
    )
    expect(mockNextImage).toHaveBeenCalledWith(
      expect.objectContaining({
        fetchPriority: 'low',
      })
    )
  })
})
