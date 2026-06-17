import {
  countUnread,
  deleteNotification,
  findNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../repository'
import type { NotificationListResult, NotificationQuery } from '../types'

export async function getNotificationList(
  userId: string,
  query: NotificationQuery
): Promise<NotificationListResult> {
  const [list, unreadCount] = await Promise.all([
    findNotifications(userId, query),
    countUnread(userId),
  ])

  return {
    items: list.items,
    nextCursor: list.nextCursor,
    unreadCount,
  }
}

export async function getUnreadCount(userId: string): Promise<number> {
  return countUnread(userId)
}

export { markNotificationRead, markAllNotificationsRead, deleteNotification }
