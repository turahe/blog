'use client'

import {
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  UserPlusIcon,
  WrenchScrewdriverIcon,
  MegaphoneIcon,
  BellAlertIcon,
} from '@heroicons/react/24/outline'
import type { NotificationCategory } from '@/generated/prisma/client'
import type { ComponentType } from 'react'

const TYPE_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  new_comment: ChatBubbleLeftRightIcon,
  comment_approved: ChatBubbleLeftRightIcon,
  comment_rejected: ChatBubbleLeftRightIcon,
  post_published: DocumentTextIcon,
  post_scheduled: DocumentTextIcon,
  draft_reminder: DocumentTextIcon,
  new_user_registered: UserPlusIcon,
  new_author_invited: UserPlusIcon,
  role_changed: ShieldCheckIcon,
  new_login: ShieldCheckIcon,
  password_changed: ShieldCheckIcon,
  email_changed: ShieldCheckIcon,
  two_factor_enabled: ShieldCheckIcon,
  failed_login: BellAlertIcon,
  backup_completed: WrenchScrewdriverIcon,
  storage_limit_warning: WrenchScrewdriverIcon,
  system_update_available: WrenchScrewdriverIcon,
  maintenance_notice: WrenchScrewdriverIcon,
  system_announcement: MegaphoneIcon,
}

const CATEGORY_ICONS: Record<NotificationCategory, ComponentType<{ className?: string }>> = {
  content: DocumentTextIcon,
  user: UserPlusIcon,
  security: ShieldCheckIcon,
  system: WrenchScrewdriverIcon,
}

export function getNotificationIcon(type: string, category: NotificationCategory) {
  return TYPE_ICONS[type] ?? CATEGORY_ICONS[category] ?? BellAlertIcon
}
