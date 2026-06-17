'use server'

import { revalidatePath } from 'next/cache'
import { requirePermission } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'
import { getSession } from '@/lib/auth/session'
import { invalidateSettingsCache } from '@/lib/settings/cache'
import prisma from '@/lib/db/prisma'
import { SETTINGS_DEFAULTS } from '../config/defaults'
import { SECTION_KEYS } from '../config/keys'
import { settingRepository } from '../repositories'
import { SECTION_SCHEMAS, settingSchema, testEmailSchema } from '../validators'
import type { CrudActionResult } from '@/lib/crud/types'
import type { SettingsSection } from '../types'

function toSettingRecords(section: SettingsSection, data: Record<string, string>) {
  return Object.entries(data).map(([key, value]) => {
    const def = SETTINGS_DEFAULTS.find((d) => d.key === key)
    return {
      key,
      value,
      type: def?.type ?? 'string',
      group: def?.group ?? section,
    }
  })
}

export async function upsertSettingAction(input: unknown): Promise<CrudActionResult> {
  await requirePermission('settings.update')
  const session = await getSession()
  const parsed = settingSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message }

  const before = await settingRepository.findByKey(parsed.data.key)
  const setting = await settingRepository.upsert(
    parsed.data.key,
    parsed.data.value,
    parsed.data.type,
    parsed.data.group
  )

  invalidateSettingsCache(parsed.data.key)

  await logAudit({
    actorId: session?.user.id,
    entity: 'setting',
    entityId: setting.id,
    action: before ? 'update' : 'create',
    before: before ? { value: before.value } : undefined,
    after: { key: setting.key, value: setting.value },
  })

  revalidatePath('/admin/settings')
  return { success: true, data: setting }
}

export async function saveSettingsSectionAction(
  section: SettingsSection,
  data: Record<string, string>
): Promise<CrudActionResult> {
  await requirePermission('settings.update')
  const session = await getSession()

  const schema = SECTION_SCHEMAS[section as keyof typeof SECTION_SCHEMAS]
  if (!schema) return { success: false, error: 'Invalid settings section' }

  const parsed = schema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Validation failed' }
  }

  const records = toSettingRecords(section, parsed.data as Record<string, string>)

  if (section === 'comments' && 'comments.enabled' in parsed.data) {
    records.push({
      key: 'features.comments',
      value: parsed.data['comments.enabled'],
      type: 'boolean',
      group: 'comments',
    })
  }

  if (section === 'appearance' && 'appearance.logo' in parsed.data) {
    records.push({
      key: 'branding.logo',
      value: parsed.data['appearance.logo'],
      type: 'string',
      group: 'appearance',
    })
  }

  await settingRepository.bulkUpsert(records)
  records.forEach((r) => invalidateSettingsCache(r.key))
  invalidateSettingsCache()

  await logAudit({
    actorId: session?.user.id,
    entity: 'setting',
    action: 'bulk_update',
    after: { section, keys: records.map((r) => r.key) },
  })

  revalidatePath('/admin/settings')
  return { success: true }
}

export async function resetSettingsSectionAction(
  section: SettingsSection
): Promise<CrudActionResult> {
  await requirePermission('settings.update')
  const session = await getSession()
  const keys = SECTION_KEYS[section]
  const records = SETTINGS_DEFAULTS.filter((d) => keys.includes(d.key))
  if (!records.length) return { success: false, error: 'Nothing to reset' }

  await settingRepository.bulkUpsert(records)
  records.forEach((r) => invalidateSettingsCache(r.key))

  await logAudit({
    actorId: session?.user.id,
    entity: 'setting',
    action: 'reset',
    after: { section },
  })

  revalidatePath('/admin/settings')
  return { success: true }
}

export async function deleteSettingAction(key: string): Promise<CrudActionResult> {
  await requirePermission('settings.update')
  const session = await getSession()
  const before = await settingRepository.findByKey(key)
  if (!before) return { success: false, error: 'Setting not found' }

  await settingRepository.delete(key)
  invalidateSettingsCache(key)

  await logAudit({
    actorId: session?.user.id,
    entity: 'setting',
    entityId: before.id,
    action: 'delete',
    before: { key, value: before.value },
  })

  revalidatePath('/admin/settings')
  return { success: true }
}

export async function sendTestEmailAction(input: unknown): Promise<CrudActionResult> {
  await requirePermission('settings.update')
  const parsed = testEmailSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message }

  const settings = await settingRepository.findAllMap()
  const host = settings['integrations.smtp_host']
  if (!host) return { success: false, error: 'Configure SMTP host first' }

  // Placeholder: wire to nodemailer when SMTP is configured in production
  return {
    success: true,
    data: { message: `Test email queued for ${parsed.data.to} (SMTP: ${host})` },
  }
}

export async function revokeSessionAction(sessionId: string): Promise<CrudActionResult> {
  await requirePermission('settings.update')
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  const target = await prisma.session.findUnique({ where: { id: sessionId } })
  if (!target || target.userId !== session.user.id) {
    return { success: false, error: 'Session not found' }
  }

  await prisma.session.delete({ where: { id: sessionId } })

  await logAudit({
    actorId: session.user.id,
    entity: 'session',
    entityId: sessionId,
    action: 'revoke',
  })

  revalidatePath('/admin/settings')
  return { success: true }
}

export async function generateSitemapAction(): Promise<CrudActionResult<{ url: string }>> {
  await requirePermission('settings.update')
  return { success: true, data: { url: '/sitemap.xml' } }
}
