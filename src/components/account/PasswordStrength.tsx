'use client'

interface PasswordStrengthProps {
  password: string
}

function scorePassword(password: string): number {
  let score = 0
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  return Math.min(score, 5)
}

const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent']
const colors = [
  'bg-error-500',
  'bg-error-400',
  'bg-warning-400',
  'bg-warning-300',
  'bg-success-400',
  'bg-success-500',
]

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null
  const score = scorePassword(password)

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={`h-1.5 flex-1 rounded-full ${index < score ? colors[score] : 'bg-gray-200 dark:bg-gray-700'}`}
          />
        ))}
      </div>
      <p className="text-theme-xs text-gray-500 dark:text-gray-400">{labels[score]}</p>
    </div>
  )
}
