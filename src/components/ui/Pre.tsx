'use client'

import { useRef, useState, ReactNode } from 'react'

export default function Pre({ children }: { children: ReactNode }) {
  const textInput = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [copied, setCopied] = useState(false)

  const onCopy = () => {
    if (!textInput.current?.textContent) return
    setCopied(true)
    navigator.clipboard.writeText(textInput.current.textContent)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      ref={textInput}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false)
        setCopied(false)
      }}
      className="relative"
    >
      {hovered && (
        <button
          aria-label="Copy code"
          type="button"
          className={`absolute top-2 right-2 h-8 w-8 rounded border-2 bg-gray-700 p-1 dark:bg-gray-800 ${copied ? 'border-green-400' : 'border-gray-300'}`}
          onClick={onCopy}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="currentColor"
            fill="none"
            className={copied ? 'text-green-400' : 'text-gray-300'}
          >
            {copied ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            )}
          </svg>
        </button>
      )}
      <pre>{children}</pre>
    </div>
  )
}
