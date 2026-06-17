'use client'

interface EditorToolbarProps {
  onInsert: (snippet: string) => void
}

const tools = [
  { label: 'H2', snippet: '\n## Heading\n' },
  { label: 'H3', snippet: '\n### Subheading\n' },
  { label: 'Bold', snippet: '**bold**' },
  { label: 'Link', snippet: '[text](url)' },
  { label: 'Image', snippet: '![alt](url)' },
  { label: 'Quote', snippet: '\n> Quote\n' },
  { label: 'Code', snippet: '\n```\ncode\n```\n' },
]

export function EditorToolbar({ onInsert }: EditorToolbarProps) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-gray-200 pb-2 dark:border-gray-700">
      {tools.map((tool) => (
        <button
          key={tool.label}
          type="button"
          onClick={() => onInsert(tool.snippet)}
          className="rounded-md border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {tool.label}
        </button>
      ))}
    </div>
  )
}
