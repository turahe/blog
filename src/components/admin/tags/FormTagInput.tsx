'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { AdminTag } from './AdminTag'
import { TagSkeleton } from './TagSkeleton'

const RECENT_KEY = 'admin-tag-input-recent'
const MAX_RECENT = 8
const MAX_SUGGESTIONS = 50

export type FormTagOption = {
  id: string
  name: string
  slug?: string
}

interface FormTagInputProps {
  label?: string
  value: string[]
  options: FormTagOption[]
  onChange: (ids: string[]) => void
  placeholder?: string
  disabled?: boolean
  loading?: boolean
  error?: string
  allowCreate?: boolean
  onCreateTag?: (name: string) => Promise<string | null>
}

export function FormTagInput({
  label = 'Tags',
  value,
  options,
  onChange,
  placeholder = 'Type to search…',
  disabled,
  loading,
  error,
  allowCreate = false,
  onCreateTag,
}: FormTagInputProps) {
  const inputId = useId()
  const listboxId = `${inputId}-listbox`
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [recentIds, setRecentIds] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY)
      if (raw) setRecentIds(JSON.parse(raw) as string[])
    } catch {
      /* ignore */
    }
  }, [])

  const selected = useMemo(() => new Set(value), [value])
  const optionMap = useMemo(() => new Map(options.map((o) => [o.id, o])), [options])

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase()
    let pool = options.filter((o) => !selected.has(o.id))

    if (q) {
      pool = pool.filter(
        (o) => o.name.toLowerCase().includes(q) || (o.slug?.toLowerCase().includes(q) ?? false)
      )
    } else if (recentIds.length > 0) {
      const recent = recentIds
        .map((id) => pool.find((o) => o.id === id))
        .filter(Boolean) as FormTagOption[]
      const rest = pool.filter((o) => !recentIds.includes(o.id))
      pool = [...recent, ...rest]
    }

    return pool.slice(0, MAX_SUGGESTIONS)
  }, [options, query, selected, recentIds])

  const rememberRecent = useCallback((id: string) => {
    setRecentIds((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, MAX_RECENT)
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  const addTag = useCallback(
    (id: string) => {
      if (selected.has(id)) return
      onChange([...value, id])
      rememberRecent(id)
      setQuery('')
      setOpen(false)
      setActiveIndex(0)
      inputRef.current?.focus()
    },
    [onChange, rememberRecent, selected, value]
  )

  const removeTag = useCallback(
    (id: string) => {
      onChange(value.filter((v) => v !== id))
      inputRef.current?.focus()
    },
    [onChange, value]
  )

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const pick = suggestions[activeIndex]
      if (pick) {
        addTag(pick.id)
        return
      }
      if (allowCreate && onCreateTag && query.trim()) {
        const createdId = await onCreateTag(query.trim())
        if (createdId) addTag(createdId)
      }
      return
    }

    if (e.key === 'Backspace' && !query && value.length > 0) {
      removeTag(value[value.length - 1]!)
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1))
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    }

    if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const containerClassName = `rounded-lg border bg-white px-2 py-1.5 dark:bg-gray-900 ${
    error ? 'border-error-300 dark:border-error-500/40' : 'border-gray-200 dark:border-gray-700'
  } ${disabled ? 'opacity-60' : 'cursor-text'}`

  const fieldContent = (
    <div className="flex flex-wrap items-center gap-1">
      {loading ? (
        <TagSkeleton count={3} size="compact" />
      ) : value.length === 0 ? (
        <span className="text-theme-xs px-1 text-gray-400">No tags assigned</span>
      ) : (
        value.map((id) => {
          const opt = optionMap.get(id)
          return (
            <AdminTag
              key={id}
              label={opt?.name ?? id}
              variant="category"
              tone="neutral"
              size="compact"
              removable
              disabled={disabled}
              onRemove={() => removeTag(id)}
            />
          )
        })
      )}

      {!disabled && (
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            setActiveIndex(0)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => void handleKeyDown(e)}
          placeholder={value.length === 0 ? placeholder : '+ Add'}
          className="text-theme-sm min-w-[5rem] flex-1 border-0 bg-transparent px-1 py-0.5 text-gray-800 placeholder:text-gray-400 focus:ring-0 focus:outline-none dark:text-gray-200"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          disabled={disabled}
        />
      )}
    </div>
  )

  return (
    <div className="admin-field">
      <label htmlFor={inputId} className="admin-label">
        {label}
      </label>

      {disabled ? (
        <div className={containerClassName}>{fieldContent}</div>
      ) : (
        <label htmlFor={inputId} className={`block ${containerClassName}`}>
          {fieldContent}
        </label>
      )}

      {error && <p className="admin-error mt-1">{error}</p>}

      {open && !disabled && suggestions.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          className="mt-1 max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {suggestions.map((opt, index) => (
            <li key={opt.id} role="option" aria-selected={index === activeIndex}>
              <button
                type="button"
                className={`text-theme-sm flex w-full items-center justify-between px-3 py-1.5 text-left ${
                  index === activeIndex
                    ? 'bg-brand-50 text-brand-800 dark:bg-brand-500/10 dark:text-brand-200'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5'
                }`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => addTag(opt.id)}
              >
                <span>{opt.name}</span>
                {opt.slug && (
                  <span className="text-theme-xs font-mono text-gray-400">{opt.slug}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
