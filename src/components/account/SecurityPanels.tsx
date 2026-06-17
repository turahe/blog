'use client'

import { useEffect, useState } from 'react'
import { formatDate } from '@/lib/formatDate'
import { ensureCsrfTokenAction } from '@/modules/auth/actions/csrf'
import {
  changePasswordAction,
  confirmMfaSetupAction,
  disableMfaAction,
  startMfaSetupAction,
} from '@/modules/account/actions'
import type { AccountSecurityOverview, MfaSetupData } from '@/modules/account/types'
import { AccountCard } from './AccountCard'
import { PasswordStrength } from './PasswordStrength'
import { useAccountUi } from './AccountUiContext'

interface SecurityPanelsProps {
  overview: AccountSecurityOverview
}

export function SecurityPanels({ overview }: SecurityPanelsProps) {
  const { showToast } = useAccountUi()
  const [csrfToken, setCsrfToken] = useState<string | null>(null)
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [mfaSetup, setMfaSetup] = useState<MfaSetupData | null>(null)
  const [mfaCode, setMfaCode] = useState('')
  const [disablePassword, setDisablePassword] = useState('')
  const [mfaEnabled, setMfaEnabled] = useState(overview.mfaEnabled)

  useEffect(() => {
    ensureCsrfTokenAction()
      .then(setCsrfToken)
      .catch(() => {})
  }, [])

  const handlePasswordChange = async () => {
    if (!csrfToken) return
    const result = await changePasswordAction(
      {
        currentPassword: passwords.current,
        newPassword: passwords.next,
        confirmPassword: passwords.confirm,
      },
      csrfToken
    )
    if (!result.success) {
      showToast(result.error ?? 'Failed to change password', 'error')
      return
    }
    setPasswords({ current: '', next: '', confirm: '' })
    showToast('Password updated successfully')
  }

  const handleStartMfa = async () => {
    if (!csrfToken) return
    const result = await startMfaSetupAction(csrfToken)
    if (!result.success || !result.data) {
      showToast(result.error ?? 'Failed to start 2FA setup', 'error')
      return
    }
    setMfaSetup(result.data)
  }

  const handleConfirmMfa = async () => {
    if (!csrfToken) return
    const result = await confirmMfaSetupAction({ code: mfaCode }, csrfToken)
    if (!result.success) {
      showToast(result.error ?? 'Invalid code', 'error')
      return
    }
    setMfaEnabled(true)
    setMfaSetup(null)
    setMfaCode('')
    showToast('Two-factor authentication enabled')
  }

  const handleDisableMfa = async () => {
    if (!csrfToken) return
    const result = await disableMfaAction(
      { password: disablePassword, code: mfaCode || undefined },
      csrfToken
    )
    if (!result.success) {
      showToast(result.error ?? 'Failed to disable 2FA', 'error')
      return
    }
    setMfaEnabled(false)
    setDisablePassword('')
    setMfaCode('')
    showToast('Two-factor authentication disabled')
  }

  return (
    <div className="space-y-6">
      <AccountCard title="Security overview">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-theme-xs font-medium tracking-wide text-gray-400 uppercase">
              Last password change
            </dt>
            <dd className="text-theme-sm mt-1 text-gray-800 dark:text-gray-200">
              {overview.lastPasswordChange ? formatDate(overview.lastPasswordChange) : 'Never'}
            </dd>
          </div>
          <div>
            <dt className="text-theme-xs font-medium tracking-wide text-gray-400 uppercase">
              Last login
            </dt>
            <dd className="text-theme-sm mt-1 text-gray-800 dark:text-gray-200">
              {overview.lastLogin ? formatDate(overview.lastLogin) : '—'}
            </dd>
          </div>
          <div>
            <dt className="text-theme-xs font-medium tracking-wide text-gray-400 uppercase">
              Last failed login
            </dt>
            <dd className="text-theme-sm mt-1 text-gray-800 dark:text-gray-200">
              {overview.lastFailedLogin ? formatDate(overview.lastFailedLogin) : 'None recorded'}
            </dd>
          </div>
          <div>
            <dt className="text-theme-xs font-medium tracking-wide text-gray-400 uppercase">
              MFA status
            </dt>
            <dd className="mt-1">
              <span
                className={`text-theme-xs inline-flex rounded-full px-2.5 py-0.5 font-medium ${
                  mfaEnabled
                    ? 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300'
                }`}
              >
                {mfaEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </dd>
          </div>
        </dl>
      </AccountCard>

      <AccountCard
        title="Change password"
        description="Use a strong password you do not use elsewhere."
      >
        <div className="grid max-w-xl gap-4">
          <div>
            <label className="admin-label" htmlFor="currentPassword">
              Current password
            </label>
            <input
              id="currentPassword"
              type={showPassword ? 'text' : 'password'}
              className="admin-input mt-1.5"
              value={passwords.current}
              onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
            />
          </div>
          <div>
            <label className="admin-label" htmlFor="newPassword">
              New password
            </label>
            <input
              id="newPassword"
              type={showPassword ? 'text' : 'password'}
              className="admin-input mt-1.5"
              value={passwords.next}
              onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
            />
            <PasswordStrength password={passwords.next} />
          </div>
          <div>
            <label className="admin-label" htmlFor="confirmPassword">
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              className="admin-input mt-1.5"
              value={passwords.confirm}
              onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
            />
          </div>
          <label className="text-theme-sm flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            Show passwords
          </label>
          <button type="button" className="admin-btn-primary w-fit" onClick={handlePasswordChange}>
            Update password
          </button>
        </div>
      </AccountCard>

      <AccountCard
        title="Two-factor authentication"
        description="Add an extra layer of security to your account."
      >
        {!mfaEnabled ? (
          <div className="space-y-4">
            {!mfaSetup ? (
              <button type="button" className="admin-btn-primary" onClick={handleStartMfa}>
                Enable 2FA
              </button>
            ) : (
              <div className="space-y-4">
                <p className="text-theme-sm text-gray-600 dark:text-gray-400">
                  Scan this QR code with your authenticator app, then enter the 6-digit code.
                </p>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(mfaSetup.otpAuthUrl)}`}
                  alt="2FA QR code"
                  className="rounded-xl border border-gray-200 dark:border-gray-700"
                />
                <div>
                  <p className="text-theme-xs text-gray-500">
                    Recovery codes (save these securely):
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2 font-mono text-xs text-gray-700 dark:text-gray-300">
                    {mfaSetup.recoveryCodes.map((code) => (
                      <span key={code} className="rounded bg-gray-100 px-2 py-1 dark:bg-white/10">
                        {code}
                      </span>
                    ))}
                  </div>
                </div>
                <input
                  className="admin-input max-w-xs"
                  placeholder="6-digit code"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                />
                <button type="button" className="admin-btn-primary" onClick={handleConfirmMfa}>
                  Verify and enable
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid max-w-md gap-3">
            <input
              type="password"
              className="admin-input"
              placeholder="Confirm password"
              value={disablePassword}
              onChange={(e) => setDisablePassword(e.target.value)}
            />
            <input
              className="admin-input"
              placeholder="2FA code (optional)"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
            />
            <button type="button" className="admin-btn-danger w-fit" onClick={handleDisableMfa}>
              Disable 2FA
            </button>
          </div>
        )}
      </AccountCard>
    </div>
  )
}
