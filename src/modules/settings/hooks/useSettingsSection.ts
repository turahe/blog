'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { saveSettingsSectionAction } from '@/modules/settings/actions'
import type { SettingsMap, SettingsSection } from '@/modules/settings/types'
import { useSettingsContext } from '@/components/admin/settings/SettingsContext'

export function useSettingsSection(
  section: SettingsSection,
  initialValues: SettingsMap,
  options?: { autoSave?: boolean; debounceMs?: number }
) {
  const { setSaveStatus, setHasUnsavedChanges, showToast } = useSettingsContext()
  const [values, setValues] = useState<SettingsMap>(initialValues)
  const valuesRef = useRef<SettingsMap>(initialValues)
  const [error, setError] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const autoSave = options?.autoSave ?? true
  const debounceMs = options?.debounceMs ?? 900

  useEffect(() => {
    setValues(initialValues)
    valuesRef.current = initialValues
    setHasUnsavedChanges(false)
    setSaveStatus('idle')
  }, [initialValues, setHasUnsavedChanges, setSaveStatus])

  const save = useCallback(
    async (nextValues?: SettingsMap) => {
      const payload = nextValues ?? values
      setSaveStatus('saving')
      setError(null)
      const result = await saveSettingsSectionAction(section, payload)
      if (!result.success) {
        setSaveStatus('error')
        setError(result.error ?? 'Save failed')
        showToast(result.error ?? 'Save failed', 'error')
        return false
      }
      setSaveStatus('saved')
      setHasUnsavedChanges(false)
      showToast('Settings saved')
      window.setTimeout(() => setSaveStatus('idle'), 2000)
      return true
    },
    [section, values, setSaveStatus, setHasUnsavedChanges, showToast]
  )

  const update = useCallback(
    (key: string, value: string) => {
      const next = { ...valuesRef.current, [key]: value }
      valuesRef.current = next
      setValues(next)
      setHasUnsavedChanges(true)
      setSaveStatus('dirty')
      if (autoSave) {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
          void save(valuesRef.current)
        }, debounceMs)
      }
    },
    [autoSave, debounceMs, save, setHasUnsavedChanges, setSaveStatus]
  )

  const setBool = useCallback(
    (key: string, checked: boolean) => update(key, checked ? 'true' : 'false'),
    [update]
  )

  return { values, update, setBool, save, error }
}
