import { Suspense } from 'react'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import { SettingsSkeleton } from '@/components/admin/settings/SettingsSkeleton'
import { SettingsApp } from '@/modules/settings/components/SettingsApp'
import {
  getAdvancedSystemInfo,
  getRolesMatrix,
  getSettingsMap,
  getUserSessions,
} from '@/modules/settings/services'
import { pickSectionValues } from '@/modules/settings/utils/pickSection'
import { SETTINGS_SECTIONS } from '@/modules/settings/types'
import type { SettingsSection } from '@/modules/settings/types'
import { requirePermission } from '@/lib/rbac'
import { getSession } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ tab?: string }>
}

function isValidTab(tab: string | undefined): tab is SettingsSection {
  return !!tab && (SETTINGS_SECTIONS as readonly string[]).includes(tab)
}

async function SettingsPageContent({ tab }: { tab: SettingsSection }) {
  const authSession = await getSession()
  const [settingsMap, roles, sessions, systemInfo] = await Promise.all([
    getSettingsMap(),
    getRolesMatrix(),
    authSession ? getUserSessions(authSession.user.id, authSession.sessionId) : Promise.resolve([]),
    getAdvancedSystemInfo(),
  ])

  return (
    <SettingsApp
      tab={tab}
      sectionValues={pickSectionValues(tab, settingsMap)}
      siteName={settingsMap['site.name'] ?? 'Wach Blog'}
      siteUrl={settingsMap['site.url'] ?? 'https://example.com'}
      roles={roles}
      sessions={sessions}
      systemInfo={systemInfo}
    />
  )
}

export default async function SettingsPage({ searchParams }: PageProps) {
  await requirePermission('settings.update')
  const params = await searchParams
  const tab: SettingsSection = isValidTab(params.tab) ? params.tab : 'general'

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Settings' }]} />
      <Suspense fallback={<SettingsSkeleton />}>
        <SettingsPageContent tab={tab} />
      </Suspense>
    </div>
  )
}
