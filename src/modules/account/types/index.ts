export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export type AccountSection = 'profile' | 'security' | 'sessions' | 'preferences' | 'notifications'

export const ACCOUNT_NAV: { id: AccountSection; href: string; label: string }[] = [
  { id: 'profile', href: '/account/profile', label: 'Profile' },
  { id: 'security', href: '/account/security', label: 'Security' },
  { id: 'sessions', href: '/account/sessions', label: 'Active Sessions' },
  { id: 'preferences', href: '/account/preferences', label: 'Preferences' },
  { id: 'notifications', href: '/account/notifications', label: 'Notifications' },
]

export interface EmailNotificationPrefs {
  newComment: boolean
  newUser: boolean
  newPostReview: boolean
  securityAlerts: boolean
}

export interface InAppNotificationPrefs {
  mentions: boolean
  comments: boolean
  systemUpdates: boolean
}

export const DEFAULT_EMAIL_NOTIFICATIONS: EmailNotificationPrefs = {
  newComment: true,
  newUser: true,
  newPostReview: true,
  securityAlerts: true,
}

export const DEFAULT_IN_APP_NOTIFICATIONS: InAppNotificationPrefs = {
  mentions: true,
  comments: true,
  systemUpdates: true,
}

export interface AccountHeaderData {
  id: string
  fullName: string
  email: string
  avatar: string | null
  primaryRole: string
  memberSince: string
  memberSinceLabel: string
}

export interface AccountProfileData {
  id: string
  fullName: string
  slug: string | null
  email: string
  bio: string | null
  website: string | null
  location: string | null
  avatar: string | null
  authorUrl: string
}

export interface AccountSecurityOverview {
  lastPasswordChange: string | null
  lastLogin: string | null
  lastFailedLogin: string | null
  mfaEnabled: boolean
}

export interface AccountSessionView {
  id: string
  device: string
  browser: string
  os: string
  ip: string | null
  location: string | null
  lastActiveAt: string
  createdAt: string
  isCurrent: boolean
}

export interface AccountPreferencesData {
  appearance: 'light' | 'dark' | 'system'
  editorMode: 'markdown' | 'rich-text'
  defaultLandingPage: string
  sidebarCollapsed: boolean
  autosaveInterval: number
  defaultPostStatus: 'draft' | 'published'
}

export interface AccountNotificationsData {
  email: EmailNotificationPrefs
  inApp: InAppNotificationPrefs
}

export interface MfaSetupData {
  secret: string
  otpAuthUrl: string
  recoveryCodes: string[]
}
