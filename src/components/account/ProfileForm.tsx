'use client'

import { useEffect, useState } from 'react'
import { ensureCsrfTokenAction } from '@/modules/auth/actions/csrf'
import { updateProfileAction, removeAvatarAction } from '@/modules/account/actions'
import type { AccountProfileData } from '@/modules/account/types'
import { AccountCard } from './AccountCard'
import { AvatarUploadField } from './AvatarUploadField'
import { useAccountUi } from './AccountUiContext'
import { AdminUserAvatar } from '@/components/admin/header/AdminUserAvatar'
import { SaveIndicator } from '@/components/admin/settings/SaveIndicator'

interface ProfileFormProps {
  profile: AccountProfileData
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const { setDirty, setSaveStatus, showToast } = useAccountUi()
  const [csrfToken, setCsrfToken] = useState<string | null>(null)
  const [form, setForm] = useState({
    fullName: profile.fullName,
    slug: profile.slug ?? '',
    bio: profile.bio ?? '',
    website: profile.website ?? '',
    location: profile.location ?? '',
    avatar: profile.avatar,
  })

  useEffect(() => {
    ensureCsrfTokenAction()
      .then(setCsrfToken)
      .catch(() => {})
  }, [])

  useEffect(() => {
    const dirty =
      form.fullName !== profile.fullName ||
      form.slug !== (profile.slug ?? '') ||
      form.bio !== (profile.bio ?? '') ||
      form.website !== (profile.website ?? '') ||
      form.location !== (profile.location ?? '') ||
      form.avatar !== profile.avatar
    setDirty(dirty)
  }, [form, profile, setDirty])

  const update = (key: keyof typeof form, value: string | null) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setSaveStatus('idle')
  }

  const handleSave = async () => {
    if (!csrfToken) return
    setSaveStatus('saving')
    const result = await updateProfileAction(
      {
        ...form,
        slug: form.slug || undefined,
        website: form.website || undefined,
      },
      csrfToken
    )
    if (!result.success) {
      setSaveStatus('error')
      showToast(result.error ?? 'Failed to save profile', 'error')
      return
    }
    setSaveStatus('saved')
    setDirty(false)
    showToast('Profile updated')
  }

  const handleRemoveAvatar = async () => {
    if (!csrfToken) return
    const result = await removeAvatarAction(csrfToken)
    if (result.success) {
      update('avatar', null)
      showToast('Avatar removed')
    }
  }

  return (
    <>
      <AccountCard
        title="Profile information"
        description="Update your public author profile and personal details."
      >
        <div className="space-y-5">
          <AvatarUploadField
            name={form.fullName}
            avatar={form.avatar}
            onChange={(url) => update('avatar', url)}
            onRemove={handleRemoveAvatar}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="admin-label" htmlFor="fullName">
                Full name
              </label>
              <input
                id="fullName"
                className="admin-input mt-1.5"
                value={form.fullName}
                onChange={(e) => update('fullName', e.target.value)}
              />
            </div>
            <div>
              <label className="admin-label" htmlFor="slug">
                Username
              </label>
              <input
                id="slug"
                className="admin-input mt-1.5"
                value={form.slug}
                onChange={(e) => update('slug', e.target.value)}
                placeholder="john-doe"
              />
            </div>
            <div className="md:col-span-2">
              <label className="admin-label" htmlFor="email">
                Email
              </label>
              <input id="email" className="admin-input mt-1.5" value={profile.email} disabled />
              <p className="text-theme-xs mt-1 text-gray-500">
                Change email from Security settings.
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="admin-label" htmlFor="bio">
                Bio
              </label>
              <textarea
                id="bio"
                className="admin-textarea mt-1.5"
                rows={4}
                value={form.bio}
                onChange={(e) => update('bio', e.target.value)}
              />
            </div>
            <div>
              <label className="admin-label" htmlFor="website">
                Website
              </label>
              <input
                id="website"
                className="admin-input mt-1.5"
                value={form.website}
                onChange={(e) => update('website', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="admin-label" htmlFor="location">
                Location
              </label>
              <input
                id="location"
                className="admin-input mt-1.5"
                value={form.location}
                onChange={(e) => update('location', e.target.value)}
                placeholder="Jakarta, Indonesia"
              />
            </div>
          </div>
        </div>
      </AccountCard>

      <AccountCard
        title="Public profile preview"
        description="How your author profile appears on the blog."
      >
        <div className="flex items-start gap-4 rounded-xl border border-dashed border-gray-200 p-4 dark:border-gray-700">
          <AdminUserAvatar name={form.fullName} avatar={form.avatar} size="lg" />
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {form.fullName || 'Your name'}
            </p>
            <p className="text-theme-sm mt-1 text-gray-500 dark:text-gray-400">
              {form.bio || 'Your bio will appear here.'}
            </p>
            <p className="text-theme-xs text-brand-600 dark:text-brand-400 mt-3 font-mono">
              {profile.authorUrl}
            </p>
          </div>
        </div>
      </AccountCard>

      <div className="fixed right-0 bottom-0 left-0 z-[120] border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur-md lg:left-[90px] dark:border-gray-800 dark:bg-gray-900/95">
        <div className="mx-auto flex max-w-4xl items-center justify-end gap-3">
          <ProfileSaveBar onSave={handleSave} />
        </div>
      </div>
    </>
  )
}

function ProfileSaveBar({ onSave }: { onSave: () => void }) {
  const { saveStatus, isDirty } = useAccountUi()
  return (
    <>
      <SaveIndicator status={saveStatus} dirty={isDirty} />
      <button
        type="button"
        onClick={onSave}
        disabled={saveStatus === 'saving' || !isDirty}
        className="admin-btn-primary"
      >
        {saveStatus === 'saving' ? 'Saving…' : 'Save changes'}
      </button>
    </>
  )
}
