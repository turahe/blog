'use client'

import { Suspense } from 'react'
import { SettingsLayout } from '@/components/admin/settings/SettingsLayout'
import { SettingsProvider } from '@/components/admin/settings/SettingsContext'
import { SettingsSidebar } from '@/components/admin/settings/SettingsSidebar'
import { SETTINGS_SECTION_META } from '@/modules/settings/config/defaults'
import type {
  AdvancedSystemInfo,
  RolePermissionMatrix,
  SessionListItem,
  SettingsMap,
  SettingsSection,
} from '@/modules/settings/types'
import { GeneralSettingsPanel } from './sections/GeneralSettingsPanel'
import { AppearanceSettingsPanel } from './sections/AppearanceSettingsPanel'
import { SeoSettingsPanel } from './sections/SeoSettingsPanel'
import { SocialSettingsPanel } from './sections/SocialSettingsPanel'
import { NavigationSettingsPanel } from './sections/NavigationSettingsPanel'
import { CommentsSettingsPanel } from './sections/CommentsSettingsPanel'
import { UsersRolesSettingsPanel } from './sections/UsersRolesSettingsPanel'
import { IntegrationsSettingsPanel } from './sections/IntegrationsSettingsPanel'
import { SecuritySettingsPanel } from './sections/SecuritySettingsPanel'
import { StorageSettingsPanel } from './sections/StorageSettingsPanel'
import { AdvancedSettingsPanel } from './sections/AdvancedSettingsPanel'

interface SettingsAppProps {
  tab: SettingsSection
  sectionValues: SettingsMap
  siteName: string
  siteUrl: string
  roles: RolePermissionMatrix[]
  sessions: SessionListItem[]
  systemInfo: AdvancedSystemInfo
}

function SectionContent({
  tab,
  sectionValues,
  siteName,
  siteUrl,
  roles,
  sessions,
  systemInfo,
}: SettingsAppProps) {
  switch (tab) {
    case 'general':
      return <GeneralSettingsPanel initialValues={sectionValues} />
    case 'appearance':
      return <AppearanceSettingsPanel initialValues={sectionValues} />
    case 'seo':
      return (
        <SeoSettingsPanel initialValues={sectionValues} siteName={siteName} siteUrl={siteUrl} />
      )
    case 'social':
      return <SocialSettingsPanel initialValues={sectionValues} />
    case 'navigation':
      return <NavigationSettingsPanel initialValues={sectionValues} />
    case 'comments':
      return <CommentsSettingsPanel initialValues={sectionValues} />
    case 'users':
      return <UsersRolesSettingsPanel roles={roles} />
    case 'integrations':
      return <IntegrationsSettingsPanel initialValues={sectionValues} />
    case 'security':
      return <SecuritySettingsPanel initialValues={sectionValues} sessions={sessions} />
    case 'storage':
      return <StorageSettingsPanel initialValues={sectionValues} systemInfo={systemInfo} />
    case 'advanced':
      return <AdvancedSettingsPanel initialValues={sectionValues} systemInfo={systemInfo} />
    default:
      return <GeneralSettingsPanel initialValues={sectionValues} />
  }
}

export function SettingsApp(props: SettingsAppProps) {
  const meta = SETTINGS_SECTION_META[props.tab] ?? SETTINGS_SECTION_META.general

  return (
    <SettingsProvider>
      <SettingsLayout
        title={meta.label}
        description={meta.description}
        sidebar={
          <Suspense
            fallback={
              <div className="h-64 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
            }
          >
            <SettingsSidebar />
          </Suspense>
        }
        showActions={props.tab !== 'users'}
      >
        <SectionContent {...props} />
      </SettingsLayout>
    </SettingsProvider>
  )
}
