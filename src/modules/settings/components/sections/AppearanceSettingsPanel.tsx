'use client'

import { useState } from 'react'
import { SettingsCard } from '@/components/admin/settings/SettingsCard'
import { SettingsField } from '@/components/admin/settings/SettingsField'
import { ImageUploader } from '@/components/admin/settings/ImageUploader'
import { ColorPicker } from '@/components/admin/settings/ColorPicker'
import { ConfirmDialog } from '@/components/admin/settings/ConfirmDialog'
import { resetSettingsSectionAction } from '@/modules/settings/actions'
import { useSettingsSection } from '@/modules/settings/hooks/useSettingsSection'
import { useSettingsContext } from '@/components/admin/settings/SettingsContext'
import type { SettingsMap } from '@/modules/settings/types'

const FONTS = ['Inter', 'Outfit', 'Geist', 'System UI']
const RADII = ['0rem', '0.375rem', '0.5rem', '0.75rem', '1rem']

export function AppearanceSettingsPanel({ initialValues }: { initialValues: SettingsMap }) {
  const { values, update } = useSettingsSection('appearance', initialValues)
  const { showToast } = useSettingsContext()
  const [confirmReset, setConfirmReset] = useState(false)

  const primary = values['appearance.primary_color'] ?? '#465fff'
  const accent = values['appearance.accent_color'] ?? '#12b76a'
  const radius = values['appearance.border_radius'] ?? '0.75rem'
  const font = values['appearance.font_family'] ?? 'Inter'

  const handleReset = async () => {
    const result = await resetSettingsSectionAction('appearance')
    setConfirmReset(false)
    showToast(
      result.success ? 'Appearance reset to defaults' : (result.error ?? 'Reset failed'),
      result.success ? 'success' : 'error'
    )
    if (result.success) window.location.reload()
  }

  return (
    <>
      <SettingsCard title="Branding" description="Logo and favicon for light and dark themes.">
        <div className="grid gap-6 md:grid-cols-2">
          <ImageUploader
            label="Logo"
            value={values['appearance.logo'] ?? ''}
            onChange={(url) => update('appearance.logo', url)}
            folder="branding"
          />
          <ImageUploader
            label="Favicon"
            value={values['appearance.favicon'] ?? ''}
            onChange={(url) => update('appearance.favicon', url)}
            folder="branding"
          />
        </div>
      </SettingsCard>

      <SettingsCard title="Theme" description="Colors, radius, and typography with live preview.">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-5">
            <ColorPicker
              label="Primary color"
              value={primary}
              onChange={(v) => update('appearance.primary_color', v)}
            />
            <ColorPicker
              label="Accent color"
              value={accent}
              onChange={(v) => update('appearance.accent_color', v)}
            />
            <SettingsField label="Border radius">
              <select
                className="admin-select"
                value={radius}
                onChange={(e) => update('appearance.border_radius', e.target.value)}
              >
                {RADII.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </SettingsField>
            <SettingsField label="Font family">
              <select
                className="admin-select"
                value={font}
                onChange={(e) => update('appearance.font_family', e.target.value)}
              >
                {FONTS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </SettingsField>
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="admin-btn-secondary"
            >
              Reset to default
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
              Live preview
            </p>
            <div
              className="overflow-hidden border border-gray-200 dark:border-gray-800"
              style={{ borderRadius: radius, fontFamily: font }}
            >
              <div className="p-4 text-white" style={{ backgroundColor: primary }}>
                <p className="text-sm font-semibold">Light header preview</p>
                <button
                  type="button"
                  className="mt-3 rounded-lg px-3 py-1.5 text-xs font-medium text-white"
                  style={{ backgroundColor: accent, borderRadius: radius }}
                >
                  Accent button
                </button>
              </div>
              <div className="bg-gray-950 p-4 text-white">
                <p className="text-sm font-semibold">Dark theme preview</p>
                <p className="mt-1 text-xs text-gray-400">Body text with {font}</p>
              </div>
            </div>
          </div>
        </div>
      </SettingsCard>

      <ConfirmDialog
        open={confirmReset}
        title="Reset appearance?"
        message="This restores default colors, fonts, and branding assets."
        confirmLabel="Reset"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => void handleReset()}
      />
    </>
  )
}
