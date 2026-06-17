import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  trend?: string
  icon?: ReactNode
}

export function StatCard({ label, value, trend, icon }: StatCardProps) {
  return (
    <div className="admin-card">
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <span className="text-gray-800 dark:text-white/90">{icon}</span>
        </div>
      )}
      <div className={`flex items-end justify-between ${icon ? 'mt-5' : ''}`}>
        <div>
          <span className="text-theme-sm text-gray-500 dark:text-gray-400">{label}</span>
          <h4 className="text-title-sm mt-2 font-bold text-gray-800 dark:text-white/90">{value}</h4>
          {trend && (
            <p className="text-theme-xs text-success-600 dark:text-success-500 mt-2">{trend}</p>
          )}
        </div>
      </div>
    </div>
  )
}
