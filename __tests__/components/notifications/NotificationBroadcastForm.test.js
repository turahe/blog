const React = require('react')
const { render, screen, waitFor } = require('@testing-library/react')
const userEvent = require('@testing-library/user-event').default
const { ensureCsrfTokenAction } = require('@/modules/auth/actions/csrf')
const { broadcastNotificationAction } = require('@/modules/notifications/actions')

jest.mock('@/modules/auth/actions/csrf', () => ({
  ensureCsrfTokenAction: jest.fn(),
}))

jest.mock('@/modules/notifications/actions', () => ({
  broadcastNotificationAction: jest.fn(),
}))

const {
  NotificationBroadcastForm,
} = require('@/components/notifications/NotificationBroadcastForm')

describe('NotificationBroadcastForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ensureCsrfTokenAction.mockResolvedValue('csrf-token')
  })

  test('renders broadcast fields', async () => {
    render(React.createElement(NotificationBroadcastForm))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Send broadcast' })).toBeEnabled()
    })

    expect(screen.getByLabelText('Type')).toBeInTheDocument()
    expect(screen.getByLabelText('Title')).toBeInTheDocument()
    expect(screen.getByLabelText('Message')).toBeInTheDocument()
    expect(screen.getByLabelText('Audience')).toBeInTheDocument()
  })

  test('submits broadcast to all users', async () => {
    broadcastNotificationAction.mockResolvedValue({
      success: true,
      data: { count: 5 },
    })
    const onSuccess = jest.fn()

    render(React.createElement(NotificationBroadcastForm, { onSuccess }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Send broadcast' })).toBeEnabled()
    })

    await userEvent.type(screen.getByLabelText('Title'), 'Maintenance tonight')
    await userEvent.type(screen.getByLabelText('Message'), 'The site will be down at midnight.')
    await userEvent.click(screen.getByRole('button', { name: 'Send broadcast' }))

    await waitFor(() => {
      expect(broadcastNotificationAction).toHaveBeenCalledWith(
        {
          title: 'Maintenance tonight',
          message: 'The site will be down at midnight.',
          type: 'system_announcement',
          target: { mode: 'all' },
        },
        'csrf-token'
      )
    })

    expect(onSuccess).toHaveBeenCalledWith(5)
    expect(screen.getByLabelText('Title')).toHaveValue('')
  })

  test('shows role options when audience is by role', async () => {
    render(React.createElement(NotificationBroadcastForm))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Send broadcast' })).toBeEnabled()
    })

    await userEvent.selectOptions(screen.getByLabelText('Audience'), 'roles')
    expect(screen.getByLabelText('admin')).toBeInTheDocument()
    expect(screen.getByLabelText('operator')).toBeInTheDocument()
  })

  test('shows error when broadcast fails', async () => {
    broadcastNotificationAction.mockResolvedValue({
      success: false,
      error: 'Permission denied',
    })

    render(React.createElement(NotificationBroadcastForm))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Send broadcast' })).toBeEnabled()
    })

    await userEvent.type(screen.getByLabelText('Title'), 'Alert')
    await userEvent.type(screen.getByLabelText('Message'), 'Something went wrong.')
    await userEvent.click(screen.getByRole('button', { name: 'Send broadcast' }))

    await waitFor(() => {
      expect(screen.getByText('Permission denied')).toBeInTheDocument()
    })
  })
})
