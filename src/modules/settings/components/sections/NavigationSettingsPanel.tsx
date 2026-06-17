'use client'

import { useCallback, useState } from 'react'
import { Bars3Icon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { SettingsCard } from '@/components/admin/settings/SettingsCard'
import { SettingsField } from '@/components/admin/settings/SettingsField'
import { useSettingsSection } from '@/modules/settings/hooks/useSettingsSection'
import type { NavigationMenuItem, SettingsMap } from '@/modules/settings/types'

function parseMenu(json: string): NavigationMenuItem[] {
  try {
    return JSON.parse(json) as NavigationMenuItem[]
  } catch {
    return []
  }
}

function MenuBuilder({
  label,
  items,
  onChange,
}: {
  label: string
  items: NavigationMenuItem[]
  onChange: (items: NavigationMenuItem[]) => void
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const updateItem = (id: string, patch: Partial<NavigationMenuItem>) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  const removeItem = (id: string) => onChange(items.filter((item) => item.id !== id))

  const addItem = () => {
    onChange([...items, { id: `item-${Date.now()}`, type: 'page', label: 'New link', href: '/' }])
  }

  const onDrop = useCallback(
    (targetIndex: number) => {
      if (dragIndex === null || dragIndex === targetIndex) return
      const next = [...items]
      const [moved] = next.splice(dragIndex, 1)
      next.splice(targetIndex, 0, moved)
      onChange(next)
      setDragIndex(null)
    },
    [dragIndex, items, onChange]
  )

  return (
    <SettingsCard title={label} description="Drag items to reorder.">
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li
            key={item.id}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(index)}
            className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4 sm:flex-row sm:items-end dark:border-gray-800 dark:bg-gray-900/30"
          >
            <button type="button" className="cursor-grab text-gray-400" aria-label="Drag">
              <Bars3Icon className="h-5 w-5" />
            </button>
            <SettingsField label="Label">
              <input
                className="admin-input"
                value={item.label}
                onChange={(e) => updateItem(item.id, { label: e.target.value })}
              />
            </SettingsField>
            <SettingsField label="Type">
              <select
                className="admin-select"
                value={item.type}
                onChange={(e) =>
                  updateItem(item.id, { type: e.target.value as NavigationMenuItem['type'] })
                }
              >
                <option value="page">Page</option>
                <option value="category">Category</option>
                <option value="external">External link</option>
              </select>
            </SettingsField>
            <SettingsField label={item.type === 'category' ? 'Category slug' : 'URL'}>
              <input
                className="admin-input"
                value={item.type === 'category' ? (item.categorySlug ?? item.href) : item.href}
                onChange={(e) => {
                  const value = e.target.value
                  if (item.type === 'category') {
                    updateItem(item.id, { categorySlug: value, href: `/category/${value}` })
                  } else {
                    updateItem(item.id, { href: value })
                  }
                }}
              />
            </SettingsField>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="admin-btn-secondary !px-3"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={addItem} className="admin-btn-secondary mt-4">
        <PlusIcon className="h-4 w-4" />
        Add menu item
      </button>
    </SettingsCard>
  )
}

export function NavigationSettingsPanel({ initialValues }: { initialValues: SettingsMap }) {
  const { values, update } = useSettingsSection('navigation', initialValues)

  const header = parseMenu(values['navigation.header'] ?? '[]')
  const footer = parseMenu(values['navigation.footer'] ?? '[]')

  return (
    <div className="space-y-6">
      <MenuBuilder
        label="Header menu"
        items={header}
        onChange={(items) => update('navigation.header', JSON.stringify(items))}
      />
      <MenuBuilder
        label="Footer menu"
        items={footer}
        onChange={(items) => update('navigation.footer', JSON.stringify(items))}
      />
    </div>
  )
}
