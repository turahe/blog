const React = require('react')
const { render, screen, waitFor } = require('@testing-library/react')
const userEvent = require('@testing-library/user-event').default
const { createCommentAction } = require('@/modules/comments/actions')

const mockRefresh = jest.fn()

jest.mock('@/modules/comments/actions', () => ({
  createCommentAction: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: mockRefresh,
  }),
  usePathname: () => '/blog/my-post',
  useSearchParams: () => new URLSearchParams(),
}))

const { CommentForm } = require('@/components/comments/CommentForm')

const baseProps = {
  postSlug: 'my-post',
  guestEnabled: true,
  isAuthenticated: false,
}

describe('CommentForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('prompts sign in when guests are disabled', () => {
    render(
      React.createElement(CommentForm, {
        ...baseProps,
        guestEnabled: false,
        isAuthenticated: false,
      })
    )

    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/login')
    expect(screen.queryByLabelText('Comment')).not.toBeInTheDocument()
  })

  test('shows guest name and email fields for unauthenticated guests', () => {
    render(React.createElement(CommentForm, baseProps))

    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Comment')).toBeInTheDocument()
  })

  test('hides guest fields for authenticated users', () => {
    render(
      React.createElement(CommentForm, {
        ...baseProps,
        isAuthenticated: true,
      })
    )

    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Email')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Comment')).toBeInTheDocument()
  })

  test('submits comment and shows moderation message', async () => {
    createCommentAction.mockResolvedValue({
      success: true,
      data: { id: 'c1', status: 'PENDING' },
    })

    const onSuccess = jest.fn()
    render(React.createElement(CommentForm, { ...baseProps, onSuccess }))

    await userEvent.type(screen.getByLabelText('Name'), 'Guest User')
    await userEvent.type(screen.getByLabelText('Email'), 'guest@example.com')
    await userEvent.type(screen.getByLabelText('Comment'), 'Nice post!')
    await userEvent.click(screen.getByRole('button', { name: 'Post comment' }))

    await waitFor(() => {
      expect(createCommentAction).toHaveBeenCalledWith({
        postSlug: 'my-post',
        content: 'Nice post!',
        parentId: undefined,
        authorName: 'Guest User',
        authorEmail: 'guest@example.com',
      })
    })

    expect(
      screen.getByText('Your comment was submitted and is awaiting moderation.')
    ).toBeInTheDocument()
    expect(onSuccess).toHaveBeenCalled()
    expect(mockRefresh).not.toHaveBeenCalled()
  })

  test('refreshes page when comment is approved immediately', async () => {
    createCommentAction.mockResolvedValue({
      success: true,
      data: { id: 'c2', status: 'APPROVED' },
    })

    render(
      React.createElement(CommentForm, {
        ...baseProps,
        isAuthenticated: true,
      })
    )

    await userEvent.type(screen.getByLabelText('Comment'), 'Approved comment')
    await userEvent.click(screen.getByRole('button', { name: 'Post comment' }))

    await waitFor(() => {
      expect(screen.getByText('Your comment was posted.')).toBeInTheDocument()
    })
    expect(mockRefresh).toHaveBeenCalled()
  })

  test('shows error when submission fails', async () => {
    createCommentAction.mockResolvedValue({
      success: false,
      error: 'Comment limit reached for this post',
    })

    render(
      React.createElement(CommentForm, {
        ...baseProps,
        isAuthenticated: true,
      })
    )

    await userEvent.type(screen.getByLabelText('Comment'), 'Too many comments')
    await userEvent.click(screen.getByRole('button', { name: 'Post comment' }))

    await waitFor(() => {
      expect(screen.getByText('Comment limit reached for this post')).toBeInTheDocument()
    })
  })

  test('calls onCancel when cancel button is clicked', async () => {
    const onCancel = jest.fn()
    render(React.createElement(CommentForm, { ...baseProps, onCancel }))

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
