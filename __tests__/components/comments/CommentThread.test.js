const React = require('react')
const { render, screen } = require('@testing-library/react')
const userEvent = require('@testing-library/user-event').default

jest.mock('@/modules/comments/actions', () => ({
  createCommentAction: jest.fn(),
}))

const { CommentThread } = require('@/components/comments/CommentThread')

const settings = {
  enabled: true,
  requireApproval: false,
  guestEnabled: true,
  limitPerPost: 100,
}

function makeComment(overrides = {}) {
  return {
    id: 'c1',
    postId: 'p1',
    postSlug: 'my-post',
    postTitle: 'My Post',
    parentId: null,
    content: 'Great article!',
    status: 'APPROVED',
    author: { name: 'Jane Doe' },
    createdAt: '2024-06-01T12:00:00.000Z',
    replies: [],
    ...overrides,
  }
}

describe('CommentThread', () => {
  test('renders comment count and list', () => {
    render(
      React.createElement(CommentThread, {
        postSlug: 'my-post',
        initialComments: [
          makeComment(),
          makeComment({
            id: 'c2',
            content: 'Thanks for sharing.',
            author: { name: 'Alex Kim' },
          }),
        ],
        settings,
        isAuthenticated: true,
      })
    )

    expect(screen.getByRole('heading', { name: 'Comments (2)' })).toBeInTheDocument()
    expect(screen.getByText('Great article!')).toBeInTheDocument()
    expect(screen.getByText('Thanks for sharing.')).toBeInTheDocument()
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('Alex Kim')).toBeInTheDocument()
  })

  test('shows empty state when there are no comments', () => {
    render(
      React.createElement(CommentThread, {
        postSlug: 'my-post',
        initialComments: [],
        settings,
        isAuthenticated: false,
      })
    )

    expect(screen.getByRole('heading', { name: 'Comments (0)' })).toBeInTheDocument()
    expect(screen.getByText('No comments yet. Be the first to comment.')).toBeInTheDocument()
  })

  test('toggles reply form for a comment', async () => {
    render(
      React.createElement(CommentThread, {
        postSlug: 'my-post',
        initialComments: [makeComment()],
        settings,
        isAuthenticated: true,
      })
    )

    await userEvent.click(screen.getByRole('button', { name: 'Reply' }))
    expect(screen.getByRole('button', { name: 'Post reply' })).toBeInTheDocument()
    expect(screen.getByLabelText('Comment')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Cancel reply' }))
    expect(screen.queryByRole('button', { name: 'Post reply' })).not.toBeInTheDocument()
  })

  test('renders nested replies', () => {
    render(
      React.createElement(CommentThread, {
        postSlug: 'my-post',
        initialComments: [
          makeComment({
            replies: [
              makeComment({
                id: 'c2',
                parentId: 'c1',
                content: 'I agree!',
                author: { name: 'Alex' },
              }),
            ],
          }),
        ],
        settings,
        isAuthenticated: true,
      })
    )

    expect(screen.getByText('Great article!')).toBeInTheDocument()
    expect(screen.getByText('I agree!')).toBeInTheDocument()
    expect(screen.getByText('Alex')).toBeInTheDocument()
  })
})
