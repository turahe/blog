export const BLOCKED_EXECUTABLE_EXTENSIONS = [
  'exe',
  'dll',
  'so',
  'dylib',
  'bat',
  'cmd',
  'com',
  'msi',
  'scr',
  'ps1',
  'vbs',
  'wsf',
  'sh',
  'bash',
  'run',
  'app',
  'apk',
  'dmg',
] as const

export const BLOCKED_EXECUTABLE_MIME_TYPES = [
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'application/x-sharedlib',
  'application/x-mach-binary',
  'application/vnd.microsoft.portable-executable',
  'application/x-apple-diskimage',
] as const

const blockedExt = new Set(BLOCKED_EXECUTABLE_EXTENSIONS)
const blockedMime = new Set(BLOCKED_EXECUTABLE_MIME_TYPES)

function getExtension(filename: string) {
  const parts = filename.split('.')
  return parts.length > 1 ? parts.pop()!.toLowerCase() : ''
}

export function isBlockedExecutable(filename: string, mimeType?: string | null): boolean {
  const ext = getExtension(filename)
  if (ext && blockedExt.has(ext as (typeof BLOCKED_EXECUTABLE_EXTENSIONS)[number])) {
    return true
  }
  const mime = (mimeType ?? '').toLowerCase().trim()
  if (mime && blockedMime.has(mime as (typeof BLOCKED_EXECUTABLE_MIME_TYPES)[number])) {
    return true
  }
  return false
}
