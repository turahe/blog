'use client'

import type {
  NotificationDateRange,
  NotificationFilterCategory,
  NotificationFilterStatus,
} from '@/modules/notifications/types'

interface NotificationFiltersProps {
  category: NotificationFilterCategory
  status: NotificationFilterStatus
  range: NotificationDateRange
  search: string
  onCategoryChange: (value: NotificationFilterCategory) => void
  onStatusChange: (value: NotificationFilterStatus) => void
  onRangeChange: (value: NotificationDateRange) => void
  onSearchChange: (value: string) => void
}

const CATEGORIES: { value: NotificationFilterCategory; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'content', label: 'Content' },
  { value: 'user', label: 'Users' },
  { value: 'security', label: 'Security' },
  { value: 'system', label: 'System' },
]

const STATUSES: { value: NotificationFilterStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'read', label: 'Read' },
]

const RANGES: { value: NotificationDateRange; label: string }[] = [
  { value: 'all', label: 'All time' },
  { value: 'today', label: 'Today' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
]

export function NotificationFilters({
  category,
  status,
  range,
  search,
  onCategoryChange,
  onStatusChange,
  onRangeChange,
  onSearchChange,
}: NotificationFiltersProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900/60">
      <div>
        <label className="admin-label" htmlFor="notification-search">
          Search
        </label>
        <input
          id="notification-search"
          className="admin-input mt-1.5"
          placeholder="Search notifications..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="admin-label" htmlFor="notification-filter-category">
            Type
          </label>
          <select
            id="notification-filter-category"
            className="admin-select mt-1.5"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value as NotificationFilterCategory)}
          >
            {CATEGORIES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="admin-label" htmlFor="notification-filter-status">
            Status
          </label>
          <select
            id="notification-filter-status"
            className="admin-select mt-1.5"
            value={status}
            onChange={(e) => onStatusChange(e.target.value as NotificationFilterStatus)}
          >
            {STATUSES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="admin-label" htmlFor="notification-filter-range">
            Date range
          </label>
          <select
            id="notification-filter-range"
            className="admin-select mt-1.5"
            value={range}
            onChange={(e) => onRangeChange(e.target.value as NotificationDateRange)}
          >
            {RANGES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
