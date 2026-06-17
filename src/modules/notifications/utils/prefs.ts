import {
  DEFAULT_EMAIL_NOTIFICATION_PREFS_EXTENDED,
  DEFAULT_IN_APP_NOTIFICATION_PREFS,
  type EmailNotificationPrefsExtended,
  type InAppNotificationPrefs,
} from '../types'

export function mapLegacyNotificationPrefs(emailRaw: unknown, inAppRaw: unknown) {
  const emailDefaults = DEFAULT_EMAIL_NOTIFICATION_PREFS_EXTENDED
  const inAppDefaults = DEFAULT_IN_APP_NOTIFICATION_PREFS
  const email = (
    emailRaw && typeof emailRaw === 'object' ? emailRaw : {}
  ) as Partial<EmailNotificationPrefsExtended> & {
    newComment?: boolean
    newUser?: boolean
    newPostReview?: boolean
  }
  const inApp = (
    inAppRaw && typeof inAppRaw === 'object' ? inAppRaw : {}
  ) as Partial<InAppNotificationPrefs> & {
    systemUpdates?: boolean
  }

  return {
    email: {
      comments: email.comments ?? email.newComment ?? emailDefaults.comments,
      contentUpdates: email.contentUpdates ?? email.newPostReview ?? emailDefaults.contentUpdates,
      securityAlerts: email.securityAlerts ?? emailDefaults.securityAlerts,
      systemAlerts: email.systemAlerts ?? emailDefaults.systemAlerts,
    },
    inApp: {
      comments: inApp.comments ?? inAppDefaults.comments,
      contentUpdates: inApp.contentUpdates ?? inAppDefaults.contentUpdates,
      mentions: inApp.mentions ?? inAppDefaults.mentions,
      reviews: inApp.reviews ?? inAppDefaults.reviews,
      security: inApp.security ?? inAppDefaults.security,
      system: inApp.system ?? inApp.systemUpdates ?? inAppDefaults.system,
    },
  }
}
