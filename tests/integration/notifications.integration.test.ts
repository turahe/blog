import assert from 'node:assert/strict'
import { after, before, it } from 'node:test'
import {
  countUnread,
  createNotificationRecord,
  deleteNotification,
  findNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/modules/notifications/repository'
import { getNotificationList } from '@/modules/notifications/services/query'
import { describeIntegration } from './helpers/describe-integration'
import { cleanupNotifications, getAdminUser } from './helpers/db'

describeIntegration('notifications integration', () => {
  const createdIds: string[] = []
  let userId = ''

  before(async () => {
    const admin = await getAdminUser()
    userId = admin.id
  })

  after(async () => {
    await cleanupNotifications(createdIds)
  })

  it('creates and queries notifications for a user', async () => {
    const stamp = Date.now()
    const record = await createNotificationRecord({
      userId,
      type: 'system_announcement',
      category: 'system',
      title: `Integration notice ${stamp}`,
      message: 'Created by integration test',
      data: { href: '/notifications' },
    })
    createdIds.push(record.id)

    const { items } = await findNotifications(userId, { tab: 'all', limit: 50 })
    const match = items.find((item) => item.id === record.id)

    assert.ok(match)
    assert.equal(match?.title, `Integration notice ${stamp}`)
    assert.equal(match?.read, false)
    assert.equal(match?.href, '/notifications')
  })

  it('marks a single notification as read', async () => {
    const record = await createNotificationRecord({
      userId,
      type: 'new_login',
      category: 'security',
      title: `Login alert ${Date.now()}`,
      message: 'New login detected',
    })
    createdIds.push(record.id)

    const updated = await markNotificationRead(userId, record.id)
    assert.equal(updated, true)

    const { items } = await findNotifications(userId, { status: 'read', limit: 20 })
    assert.equal(
      items.some((item) => item.id === record.id && item.read),
      true
    )
  })

  it('marks all notifications as read via service layer', async () => {
    const first = await createNotificationRecord({
      userId,
      type: 'system_announcement',
      category: 'system',
      title: `Bulk read A ${Date.now()}`,
      message: 'Unread A',
    })
    const second = await createNotificationRecord({
      userId,
      type: 'system_announcement',
      category: 'system',
      title: `Bulk read B ${Date.now()}`,
      message: 'Unread B',
    })
    createdIds.push(first.id, second.id)

    const before = await countUnread(userId)
    assert.ok(before >= 2)

    const marked = await markAllNotificationsRead(userId)
    assert.ok(marked >= 2)

    const after = await countUnread(userId)
    assert.equal(after, 0)
  })

  it('deletes a notification', async () => {
    const record = await createNotificationRecord({
      userId,
      type: 'system_announcement',
      category: 'system',
      title: `Delete me ${Date.now()}`,
      message: 'Temporary notification',
    })

    const deleted = await deleteNotification(userId, record.id)
    assert.equal(deleted, true)

    const { items } = await findNotifications(userId, { tab: 'all', limit: 50 })
    assert.equal(
      items.some((item) => item.id === record.id),
      false
    )
  })

  it('filters unread notifications through getNotificationList', async () => {
    const unread = await createNotificationRecord({
      userId,
      type: 'post_published',
      category: 'content',
      title: `Unread filter ${Date.now()}`,
      message: 'Should appear in unread tab',
    })
    createdIds.push(unread.id)

    const result = await getNotificationList(userId, { tab: 'unread', limit: 50 })
    assert.equal(
      result.items.some((item) => item.id === unread.id),
      true
    )
    assert.ok(result.unreadCount > 0)
  })
})
