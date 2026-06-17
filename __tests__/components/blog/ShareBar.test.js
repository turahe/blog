const React = require('react')
const { render, screen } = require('@testing-library/react')
const userEvent = require('@testing-library/user-event').default
const { ShareBar } = require('@/components/blog/ShareBar')

describe('ShareBar', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: jest.fn().mockResolvedValue(undefined) },
    })
  })

  test('renders social share links with encoded url', () => {
    render(
      React.createElement(ShareBar, {
        url: 'https://example.com/post',
        title: 'Hello World',
      })
    )
    const twitter = screen.getByRole('link', { name: 'Twitter' })
    expect(twitter).toHaveAttribute('href', expect.stringContaining('twitter.com'))
    expect(twitter).toHaveAttribute(
      'href',
      expect.stringContaining(encodeURIComponent('https://example.com/post'))
    )
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      expect.stringContaining('linkedin.com')
    )
  })

  test('copies link to clipboard', async () => {
    render(React.createElement(ShareBar, { url: 'https://example.com/post', title: 'Hello' }))
    await userEvent.click(screen.getByRole('button', { name: 'Copy link' }))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://example.com/post')
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()
  })
})
