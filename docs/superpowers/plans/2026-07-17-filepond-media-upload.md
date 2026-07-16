# FilePond Media Upload Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Accept all non-executable MIME types via FilePond, upload through `POST /api/media/upload`, and document the pattern in `.cursor/skills/`.

**Architecture:** Shared executable deny-list + avatar image allow-list; storage no longer uses a MIME allow-list; a Next.js route handles FilePond `process`/`revert`; a `FilePondUpload` client component replaces custom dropzones in the media library, media picker, and avatar field.

**Tech Stack:** Next.js App Router, `filepond` + `react-filepond`, existing MinIO/mock storage, Jest, Prisma media repository.

**Spec:** `docs/superpowers/specs/2026-07-17-filepond-media-upload-design.md`

## Global Constraints

- Media: allow any MIME except executables; max `25MB` (`MAX_FILE_BYTES`).
- Avatar: JPEG/PNG/WebP/GIF only; max `5MB` after crop; keep square-crop UI.
- Transport: FilePond `server.process` → `POST /api/media/upload` (primary path).
- Permissions: `purpose=media` requires `media.upload`; `purpose=avatar` requires authenticated session only.
- Always create a media DB row (library under folder path; avatar under `avatars`).
- Skills: new `media-upload` skill + short Impeccable cross-link.

## File Structure

| File | Responsibility |
| --- | --- |
| `src/modules/media/executable-policy.ts` | Deny-list + `isBlockedExecutable(filename, mimeType)` |
| `src/modules/media/constants.ts` | Avatar allow-list, size caps; retire allow-list enforcement role of `ALLOWED_MIME_TYPES` |
| `src/modules/media/services/upload.ts` | Shared upload orchestration (storage + DB + audit) |
| `src/app/api/media/upload/route.ts` | FilePond process (`POST`) + revert (`DELETE`) |
| `src/components/media/FilePondUpload.tsx` | Shared FilePond client wrapper |
| `src/components/admin/media/MediaUploader.tsx` | Library integration (browse via ref) |
| `src/components/admin/media/picker/MediaUploadDropzone.tsx` | Picker upload tab |
| `src/components/account/AvatarUploadField.tsx` | Avatar FilePond + crop + API upload |
| `src/lib/storage/minio.ts` | Enforce deny-list instead of allow-list |
| `.cursor/skills/media-upload/SKILL.md` | Agent guidance for uploads |
| `.cursor/skills/impeccable/reference/interaction-design.md` | Cross-link to media-upload skill |
| `__tests__/modules/media/executable-policy.test.js` | Policy unit tests |
| `__tests__/lib/minio.test.js` | Storage deny-list behavior |
| `__tests__/api/media-upload.test.js` | Route auth/validation tests |

---

### Task 1: Executable policy module

**Files:**
- Create: `src/modules/media/executable-policy.ts`
- Create: `__tests__/modules/media/executable-policy.test.js`
- Modify: `src/modules/media/constants.ts` (add avatar allow-list + `AVATAR_MAX_BYTES`)

**Interfaces:**
- Produces:
  - `BLOCKED_EXECUTABLE_EXTENSIONS: readonly string[]`
  - `BLOCKED_EXECUTABLE_MIME_TYPES: readonly string[]`
  - `isBlockedExecutable(filename: string, mimeType?: string | null): boolean`
  - `AVATAR_ALLOWED_MIME_TYPES` and `AVATAR_MAX_BYTES` from constants
  - `isAllowedAvatarMime(mimeType: string): boolean`

- [ ] **Step 1: Write the failing test**

Create `__tests__/modules/media/executable-policy.test.js`:

```js
const {
  isBlockedExecutable,
} = require('@/modules/media/executable-policy')

describe('isBlockedExecutable', () => {
  test('allows common documents and media', () => {
    expect(isBlockedExecutable('doc.pdf', 'application/pdf')).toBe(false)
    expect(isBlockedExecutable('archive.zip', 'application/zip')).toBe(false)
    expect(isBlockedExecutable('song.mp3', 'audio/mpeg')).toBe(false)
    expect(isBlockedExecutable('notes.txt', 'text/plain')).toBe(false)
  })

  test('blocks executable extensions regardless of mime', () => {
    expect(isBlockedExecutable('setup.exe', 'application/octet-stream')).toBe(true)
    expect(isBlockedExecutable('tool.DLL', 'application/octet-stream')).toBe(true)
    expect(isBlockedExecutable('run.sh', '')).toBe(true)
  })

  test('blocks executable mime types even with safe-looking names', () => {
    expect(isBlockedExecutable('payload.bin', 'application/x-msdownload')).toBe(true)
    expect(
      isBlockedExecutable('payload.bin', 'application/vnd.microsoft.portable-executable')
    ).toBe(true)
  })

  test('allows octet-stream when extension is not blocked', () => {
    expect(isBlockedExecutable('data.bin', 'application/octet-stream')).toBe(false)
    expect(isBlockedExecutable('report.pdf', 'application/octet-stream')).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/modules/media/executable-policy.test.js`

Expected: FAIL (module not found)

- [ ] **Step 3: Implement policy + avatar constants**

Create `src/modules/media/executable-policy.ts`:

```ts
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
```

In `src/modules/media/constants.ts`, keep `ALLOWED_MIME_TYPES` for now (may still be referenced) but add:

```ts
export const AVATAR_ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const

export const AVATAR_MAX_BYTES = 5 * 1024 * 1024

export function isAllowedAvatarMime(mime: string) {
  return (AVATAR_ALLOWED_MIME_TYPES as readonly string[]).includes(mime)
}
```

Do **not** remove `ALLOWED_MIME_TYPES` in this task; storage switch happens in Task 2.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- __tests__/modules/media/executable-policy.test.js`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/modules/media/executable-policy.ts src/modules/media/constants.ts __tests__/modules/media/executable-policy.test.js
git commit -m "$(cat <<'EOF'
feat(media): add executable deny-list policy

Centralize MIME/extension checks so uploads can allow all non-executables.
EOF
)"
```

---

### Task 2: Storage deny-list enforcement

**Files:**
- Modify: `src/lib/storage/minio.ts`
- Modify: `__tests__/lib/minio.test.js`

**Interfaces:**
- Consumes: `isBlockedExecutable` from `@/modules/media/executable-policy`
- Produces: `uploadBufferToMinio` / `uploadFileToMinio` reject only executables (and size), not allow-list misses

- [ ] **Step 1: Update failing expectations in minio tests**

Replace the existing `uploadBufferToMinio rejects unsupported mime type` test with:

```js
  test('uploadBufferToMinio rejects blocked executables', async () => {
    await expect(
      uploadBufferToMinio(
        Buffer.from('x'),
        'malware.exe',
        'application/x-msdownload',
        'media/x.exe'
      )
    ).rejects.toThrow('Executable files are not allowed')
  })

  test('uploadBufferToMinio allows previously unsupported non-executables', async () => {
    const buffer = Buffer.from('audio-bytes')
    const result = await uploadBufferToMinio(
      buffer,
      'track.mp3',
      'audio/mpeg',
      'media/2026/06/track.mp3'
    )
    expect(result.mimeType).toBe('audio/mpeg')
    expect(mockSend).toHaveBeenCalledTimes(1)
  })
```

- [ ] **Step 2: Run tests to verify failure mode**

Run: `npm test -- __tests__/lib/minio.test.js`

Expected: FAIL on new error message / mp3 allow (still allow-list based)

- [ ] **Step 3: Update `minio.ts`**

In `src/lib/storage/minio.ts`:

1. Remove `LEGACY_IMAGE_TYPES` and `ALLOWED_MIME_TYPES` imports usage for gating.
2. Import `isBlockedExecutable` from `@/modules/media/executable-policy`.
3. In `uploadBufferToMinio` and `uploadFileToMinio`, replace allow-list checks with:

```ts
  if (isBlockedExecutable(filename, mimeType)) {
    throw new Error('Executable files are not allowed')
  }
```

and for files:

```ts
  if (isBlockedExecutable(file.name, file.type)) {
    throw new Error('Executable files are not allowed')
  }
```

Keep size checks and image variant behavior unchanged.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- __tests__/lib/minio.test.js`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/storage/minio.ts __tests__/lib/minio.test.js
git commit -m "$(cat <<'EOF'
feat(storage): allow all non-executable uploads

Replace MIME allow-list with shared executable deny-list in MinIO helpers.
EOF
)"
```

---

### Task 3: Upload service + FilePond API route

**Files:**
- Create: `src/modules/media/services/upload.ts`
- Create: `src/app/api/media/upload/route.ts`
- Create: `__tests__/api/media-upload.test.js`
- Modify: `src/modules/media/actions/index.ts` (`uploadMediaAction` delegates to service)

**Interfaces:**
- Produces:
  - `processMediaUpload(input: { file: File; folderId?: string | null; folderPath?: string | null; purpose: 'media' | 'avatar'; actorId?: string }): Promise<{ id: string; url: string; filename: string; altText: string | null; width: number | null; height: number | null }>`
  - `POST /api/media/upload` → JSON `{ id, url, filename, altText, width, height }`
  - `DELETE /api/media/upload` with body = media id (FilePond revert) → `{ ok: true }`

- [ ] **Step 1: Write failing route tests**

Create `__tests__/api/media-upload.test.js`:

```js
jest.mock('@/lib/auth/session', () => ({
  getSession: jest.fn(),
}))
jest.mock('@/lib/rbac', () => ({
  can: jest.fn(),
}))
jest.mock('@/modules/media/services/upload', () => ({
  processMediaUpload: jest.fn(),
  revertMediaUpload: jest.fn(),
}))

const { getSession } = require('@/lib/auth/session')
const { can } = require('@/lib/rbac')
const { processMediaUpload, revertMediaUpload } = require('@/modules/media/services/upload')
const { POST, DELETE } = require('@/app/api/media/upload/route')

function makeFile(name, type, content = 'x') {
  return new File([content], name, { type })
}

describe('POST /api/media/upload', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns 401 when unauthenticated', async () => {
    getSession.mockResolvedValue(null)
    const form = new FormData()
    form.append('filepond', makeFile('a.pdf', 'application/pdf'))
    const req = new Request('http://localhost/api/media/upload', { method: 'POST', body: form })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  test('returns 400 for blocked executable', async () => {
    getSession.mockResolvedValue({ user: { id: 'u1' } })
    can.mockResolvedValue(true)
    const form = new FormData()
    form.append('filepond', makeFile('virus.exe', 'application/x-msdownload'))
    const req = new Request('http://localhost/api/media/upload?purpose=media', {
      method: 'POST',
      body: form,
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toMatch(/executable/i)
    expect(processMediaUpload).not.toHaveBeenCalled()
  })

  test('returns 403 when media purpose lacks media.upload', async () => {
    getSession.mockResolvedValue({ user: { id: 'u1' } })
    can.mockResolvedValue(false)
    const form = new FormData()
    form.append('filepond', makeFile('a.pdf', 'application/pdf'))
    const req = new Request('http://localhost/api/media/upload?purpose=media', {
      method: 'POST',
      body: form,
    })
    const res = await POST(req)
    expect(res.status).toBe(403)
  })

  test('uploads media when permitted', async () => {
    getSession.mockResolvedValue({ user: { id: 'u1' } })
    can.mockResolvedValue(true)
    processMediaUpload.mockResolvedValue({
      id: 'm1',
      url: 'http://cdn/x.pdf',
      filename: 'a.pdf',
      altText: null,
      width: null,
      height: null,
    })
    const form = new FormData()
    form.append('filepond', makeFile('a.pdf', 'application/pdf'))
    const req = new Request('http://localhost/api/media/upload?purpose=media', {
      method: 'POST',
      body: form,
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.id).toBe('m1')
    expect(json.url).toBe('http://cdn/x.pdf')
  })

  test('avatar purpose does not require media.upload', async () => {
    getSession.mockResolvedValue({ user: { id: 'u1' } })
    can.mockResolvedValue(false)
    processMediaUpload.mockResolvedValue({
      id: 'm2',
      url: 'http://cdn/a.jpg',
      filename: 'avatar.jpg',
      altText: null,
      width: 256,
      height: 256,
    })
    const form = new FormData()
    form.append('filepond', makeFile('avatar.jpg', 'image/jpeg'))
    const req = new Request('http://localhost/api/media/upload?purpose=avatar', {
      method: 'POST',
      body: form,
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(can).not.toHaveBeenCalled()
  })
})

describe('DELETE /api/media/upload', () => {
  test('returns 401 when unauthenticated', async () => {
    getSession.mockResolvedValue(null)
    const req = new Request('http://localhost/api/media/upload', {
      method: 'DELETE',
      body: 'm1',
    })
    const res = await DELETE(req)
    expect(res.status).toBe(401)
  })

  test('reverts upload when permitted', async () => {
    getSession.mockResolvedValue({ user: { id: 'u1' } })
    can.mockResolvedValue(true)
    revertMediaUpload.mockResolvedValue(undefined)
    const req = new Request('http://localhost/api/media/upload', {
      method: 'DELETE',
      body: 'm1',
    })
    const res = await DELETE(req)
    expect(res.status).toBe(200)
    expect(revertMediaUpload).toHaveBeenCalledWith('m1', 'u1')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- __tests__/api/media-upload.test.js`

Expected: FAIL (route/service missing)

- [ ] **Step 3: Implement upload service**

Create `src/modules/media/services/upload.ts`:

```ts
import { revalidatePath } from 'next/cache'
import { logAudit } from '@/lib/audit'
import { uploadFileToMinio, deleteObjectFromMinio } from '@/lib/storage/minio'
import {
  AVATAR_MAX_BYTES,
  MAX_FILE_BYTES,
  isAllowedAvatarMime,
} from '@/modules/media/constants'
import { isBlockedExecutable } from '@/modules/media/executable-policy'
import { mediaFolderRepository, mediaRepository } from '@/modules/media/repositories'

export type UploadPurpose = 'media' | 'avatar'

export type ProcessMediaUploadInput = {
  file: File
  folderId?: string | null
  folderPath?: string | null
  purpose: UploadPurpose
  actorId?: string
}

export type ProcessMediaUploadResult = {
  id: string
  url: string
  filename: string
  altText: string | null
  width: number | null
  height: number | null
}

function revalidateMedia() {
  revalidatePath('/admin/media')
}

export async function processMediaUpload(
  input: ProcessMediaUploadInput
): Promise<ProcessMediaUploadResult> {
  const { file, purpose, actorId } = input

  if (!(file instanceof File) || file.size === 0) {
    throw new Error('No file provided')
  }

  if (isBlockedExecutable(file.name, file.type)) {
    throw new Error('Executable files are not allowed')
  }

  if (purpose === 'avatar') {
    if (!isAllowedAvatarMime(file.type)) {
      throw new Error('Avatar must be JPEG, PNG, WebP, or GIF')
    }
    if (file.size > AVATAR_MAX_BYTES) {
      throw new Error('Avatar must be 5MB or smaller')
    }
  } else if (file.size > MAX_FILE_BYTES) {
    throw new Error('File must be 25MB or smaller')
  }

  const folderPath =
    purpose === 'avatar'
      ? 'avatars'
      : input.folderId
        ? await mediaFolderRepository.resolveStoragePath(input.folderId)
        : (input.folderPath ?? 'media')

  const uploaded = await uploadFileToMinio(file, folderPath)
  const media = await mediaRepository.create({
    key: uploaded.key,
    url: uploaded.url,
    filename: uploaded.filename,
    originalName: uploaded.originalName,
    mimeType: uploaded.mimeType,
    extension: uploaded.extension,
    size: uploaded.size,
    width: uploaded.width,
    height: uploaded.height,
    folder: folderPath,
    variants: uploaded.variants,
    folderRef: input.folderId ? { connect: { id: input.folderId } } : undefined,
    uploadedBy: actorId ? { connect: { id: actorId } } : undefined,
  })

  await logAudit({
    actorId,
    entity: 'media',
    entityId: media.id,
    action: 'create',
    after: { key: media.key, url: media.url, purpose },
  })

  revalidateMedia()

  return {
    id: media.id,
    url: media.url,
    filename: media.filename,
    altText: media.altText,
    width: media.width,
    height: media.height,
  }
}

export async function revertMediaUpload(mediaId: string, actorId?: string) {
  const media = await mediaRepository.findById(mediaId)
  if (!media) return

  // Uploader may revert their own just-uploaded file; admins with media.delete also OK.
  // Callers must enforce auth; this function only deletes if found.
  try {
    await deleteObjectFromMinio(media.key)
  } catch {
    /* gone */
  }
  await mediaRepository.delete(mediaId)
  await logAudit({
    actorId,
    entity: 'media',
    entityId: mediaId,
    action: 'delete',
    before: { key: media.key, reason: 'filepond-revert' },
  })
  revalidateMedia()
}
```

Match `mediaRepository.create` field shapes to the existing `uploadMediaAction` implementation (copy types from `src/modules/media/actions/index.ts` if the snippet above drifts).

- [ ] **Step 4: Implement API route**

Create `src/app/api/media/upload/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { can } from '@/lib/rbac'
import { isBlockedExecutable } from '@/modules/media/executable-policy'
import { isAllowedAvatarMime } from '@/modules/media/constants'
import {
  processMediaUpload,
  revertMediaUpload,
  type UploadPurpose,
} from '@/modules/media/services/upload'

function getUploadFile(formData: FormData): File | null {
  const candidates = ['filepond', 'file', 'files']
  for (const key of candidates) {
    const value = formData.get(key)
    if (value instanceof File && value.size > 0) return value
  }
  for (const value of formData.values()) {
    if (value instanceof File && value.size > 0) return value
  }
  return null
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const purpose = (url.searchParams.get('purpose') ?? 'media') as UploadPurpose
  if (purpose !== 'media' && purpose !== 'avatar') {
    return NextResponse.json({ error: 'Invalid purpose' }, { status: 400 })
  }

  if (purpose === 'media') {
    const allowed = await can('media.upload', session.user.id)
    if (!allowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid multipart body' }, { status: 400 })
  }

  const file = getUploadFile(formData)
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (isBlockedExecutable(file.name, file.type)) {
    return NextResponse.json({ error: 'Executable files are not allowed' }, { status: 400 })
  }

  if (purpose === 'avatar' && !isAllowedAvatarMime(file.type)) {
    return NextResponse.json(
      { error: 'Avatar must be JPEG, PNG, WebP, or GIF' },
      { status: 400 }
    )
  }

  const folderId = formData.get('folderId') ? String(formData.get('folderId')) : null
  const folderPath = formData.get('folderPath') ? String(formData.get('folderPath')) : null

  try {
    const result = await processMediaUpload({
      file,
      folderId,
      folderPath,
      purpose,
      actorId: session.user.id,
    })
    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    const status = /too large|25MB|5MB|Executable|Avatar must|No file/i.test(message) ? 400 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

export async function DELETE(request: Request) {
  const session = await getSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const mediaId = (await request.text()).trim()
  if (!mediaId) {
    return NextResponse.json({ error: 'Missing media id' }, { status: 400 })
  }

  const media = await (
    await import('@/modules/media/repositories')
  ).mediaRepository.findById(mediaId)
  if (!media) {
    return NextResponse.json({ ok: true })
  }

  const isOwner = media.uploadedBy?.id === session.user.id
  const canDelete = (await can('media.delete', session.user.id)) || isOwner
  if (!canDelete) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await revertMediaUpload(mediaId, session.user.id)
  return NextResponse.json({ ok: true })
}
```

If `media.uploadedBy` shape differs, use whatever `findById` returns (e.g. `uploadedById`) — match the repository type.

- [ ] **Step 5: Refactor `uploadMediaAction` to call the service**

In `src/modules/media/actions/index.ts`, replace the body of `uploadMediaAction` with a call to `processMediaUpload({ file, folderId, folderPath: folderPathOverride, purpose: 'media', actorId: session?.user.id })`, mapping errors to `{ success: false, error }` as today.

- [ ] **Step 6: Run route + related tests**

Run:

```bash
npm test -- __tests__/api/media-upload.test.js __tests__/lib/minio.test.js __tests__/modules/media/executable-policy.test.js
```

Expected: PASS

Fix `uploadedBy` ownership check if types fail TypeScript/`tsc` in CI; prefer reading `mediaRepository.findById` return type and adjusting DELETE accordingly.

- [ ] **Step 7: Commit**

```bash
git add src/modules/media/services/upload.ts src/app/api/media/upload/route.ts src/modules/media/actions/index.ts __tests__/api/media-upload.test.js
git commit -m "$(cat <<'EOF'
feat(media): add FilePond upload API route

Extract shared upload service and expose process/revert endpoints.
EOF
)"
```

---

### Task 4: Shared `FilePondUpload` component

**Files:**
- Modify: `package.json` / lockfile (install deps)
- Create: `src/components/media/FilePondUpload.tsx`
- Modify: global CSS entry used by admin (import FilePond CSS once — prefer importing from the component file)

**Interfaces:**
- Produces React component:

```ts
export type FilePondUploadProps = {
  purpose: 'media' | 'avatar'
  folderId?: string | null
  folderPath?: string
  allowMultiple?: boolean
  className?: string
  onUploaded?: (result: { id: string; url: string; filename: string }) => void
  onError?: (message: string) => void
  /** Imperative browse for toolbar buttons */
  browseRef?: React.MutableRefObject<(() => void) | null>
}
```

- [ ] **Step 1: Install packages**

Run:

```bash
npm install filepond react-filepond filepond-plugin-file-validate-type filepond-plugin-file-validate-size filepond-plugin-image-preview
```

- [ ] **Step 2: Implement `FilePondUpload`**

Create `src/components/media/FilePondUpload.tsx`:

```tsx
'use client'

import { useEffect, useRef } from 'react'
import { FilePond, registerPlugin } from 'react-filepond'
import type { FilePond as FilePondInstance, FilePondFile } from 'filepond'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import {
  AVATAR_ALLOWED_MIME_TYPES,
  AVATAR_MAX_BYTES,
  MAX_FILE_BYTES,
} from '@/modules/media/constants'
import { isBlockedExecutable } from '@/modules/media/executable-policy'

registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
  FilePondPluginImagePreview
)

export type FilePondUploadProps = {
  purpose: 'media' | 'avatar'
  folderId?: string | null
  folderPath?: string
  allowMultiple?: boolean
  className?: string
  onUploaded?: (result: { id: string; url: string; filename: string }) => void
  onError?: (message: string) => void
  browseRef?: React.MutableRefObject<(() => void) | null>
  /** When false, files are not auto-uploaded (avatar crop flow). Default true. */
  instantUpload?: boolean
  onLocalFile?: (file: File) => void
}

export function FilePondUpload({
  purpose,
  folderId,
  folderPath,
  allowMultiple = true,
  className,
  onUploaded,
  onError,
  browseRef,
  instantUpload = true,
  onLocalFile,
}: FilePondUploadProps) {
  const pondRef = useRef<FilePondInstance | null>(null)

  useEffect(() => {
    if (!browseRef) return
    browseRef.current = () => {
      pondRef.current?.browse()
    }
    return () => {
      browseRef.current = null
    }
  }, [browseRef])

  const accepted =
    purpose === 'avatar' ? [...AVATAR_ALLOWED_MIME_TYPES] : undefined
  const maxBytes = purpose === 'avatar' ? AVATAR_MAX_BYTES : MAX_FILE_BYTES

  const processUrl = `/api/media/upload?purpose=${purpose}`

  return (
    <div className={className}>
      <FilePond
        ref={(ref) => {
          pondRef.current = ref
        }}
        allowMultiple={allowMultiple}
        maxFiles={allowMultiple ? 20 : 1}
        instantUpload={instantUpload}
        acceptedFileTypes={accepted}
        maxFileSize={`${Math.floor(maxBytes / (1024 * 1024))}MB`}
        labelIdle='Drag & drop files or <span class="filepond--label-action">browse</span>'
        labelFileTypeNotAllowed="File type is not allowed"
        fileValidateTypeLabelExpectedTypes={
          purpose === 'avatar' ? 'Expects JPEG, PNG, WebP, or GIF' : 'Executables are not allowed'
        }
        beforeAddFile={(item) => {
          const file = item.file as File
          if (purpose === 'media' && isBlockedExecutable(file.name, file.type)) {
            onError?.('Executable files are not allowed')
            return false
          }
          if (onLocalFile) {
            onLocalFile(file)
            return purpose === 'avatar' ? false : true
          }
          return true
        }}
        server={
          instantUpload
            ? {
                process: {
                  url: processUrl,
                  method: 'POST',
                  withCredentials: true,
                  ondata: (formData) => {
                    if (folderId) formData.append('folderId', folderId)
                    if (folderPath) formData.append('folderPath', folderPath)
                    return formData
                  },
                  onload: (response) => {
                    try {
                      const data = JSON.parse(response)
                      onUploaded?.({
                        id: data.id,
                        url: data.url,
                        filename: data.filename,
                      })
                      return data.id
                    } catch {
                      onError?.('Invalid upload response')
                      return response
                    }
                  },
                  onerror: (response) => {
                    try {
                      const data = JSON.parse(response)
                      onError?.(data.error ?? 'Upload failed')
                    } catch {
                      onError?.('Upload failed')
                    }
                  },
                },
                revert: {
                  url: '/api/media/upload',
                  method: 'DELETE',
                  withCredentials: true,
                },
              }
            : null
        }
        credits={false}
      />
    </div>
  )
}
```

Adjust `react-filepond` / FilePond typings if the project’s TS config requires slightly different `ref` or `server` shapes — keep behavior identical.

- [ ] **Step 3: Smoke-check TypeScript for the new component**

Run: `npx tsc --noEmit -p tsconfig.json` (or the project’s usual typecheck script if present in `package.json`)

Expected: no errors in the new files (fix any typing mismatches).

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/components/media/FilePondUpload.tsx
git commit -m "$(cat <<'EOF'
feat(media): add shared FilePondUpload component

Wrap FilePond with media deny-list and avatar allow-list modes.
EOF
)"
```

---

### Task 5: Wire media library + picker

**Files:**
- Modify: `src/components/admin/media/MediaUploader.tsx`
- Modify: `src/components/admin/media/picker/MediaUploadDropzone.tsx`
- Modify: `src/components/admin/media/picker/types.ts` (remove or stop using `PICKER_IMAGE_ACCEPT` for upload gating)
- Modify: `src/components/admin/media/picker/index.ts` if exports change

**Interfaces:**
- Consumes: `FilePondUpload`
- Media library `openRef` continues to trigger browse
- Picker `onUploadComplete(ids: string[])` still fires after successful uploads

- [ ] **Step 1: Rewrite `MediaUploader`**

Replace implementation with FilePond (keep `openRef` + `onComplete` + toast):

```tsx
'use client'

import { useRef } from 'react'
import { FilePondUpload } from '@/components/media/FilePondUpload'
import { useMediaContext } from './MediaContext'

interface MediaUploaderProps {
  folderId: string | null
  onComplete?: () => void
  openRef?: React.MutableRefObject<(() => void) | null>
}

export function MediaUploader({ folderId, onComplete, openRef }: MediaUploaderProps) {
  const { showToast } = useMediaContext()
  const browseRef = useRef<(() => void) | null>(null)

  if (openRef) {
    openRef.current = () => browseRef.current?.()
  }

  return (
    <FilePondUpload
      purpose="media"
      folderId={folderId}
      allowMultiple
      browseRef={browseRef}
      className="rounded-xl border border-dashed border-gray-200 p-3 dark:border-gray-800"
      onUploaded={() => {
        showToast('Upload complete')
        onComplete?.()
      }}
      onError={(message) => showToast(message)}
    />
  )
}
```

If always-visible FilePond is too tall for the library header, keep a compact height via CSS (`max-h` / FilePond style overrides) without changing behavior.

- [ ] **Step 2: Rewrite `MediaUploadDropzone`**

```tsx
'use client'

import { useRef } from 'react'
import { FilePondUpload } from '@/components/media/FilePondUpload'

interface MediaUploadDropzoneProps {
  folderId?: string | null
  folderPath?: string
  onUploadComplete: (uploadedIds: string[]) => void
}

export function MediaUploadDropzone({
  folderId,
  folderPath,
  onUploadComplete,
}: MediaUploadDropzoneProps) {
  const uploadedIds = useRef<string[]>([])

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-1">
      <FilePondUpload
        purpose="media"
        folderId={folderId}
        folderPath={folderPath}
        allowMultiple
        className="min-h-[280px]"
        onUploaded={(result) => {
          uploadedIds.current.push(result.id)
          onUploadComplete([...uploadedIds.current])
        }}
      />
    </div>
  )
}
```

Update picker copy elsewhere that says “images only” if present (e.g. empty state text in `MediaPickerGrid`).

Remove unused `PICKER_IMAGE_ACCEPT` / `PICKER_MAX_BYTES` from `types.ts` if nothing else imports them.

- [ ] **Step 3: Manual verification checklist (dev server)**

Run: `npm run dev`

Verify:

1. Admin media → Upload files opens FilePond browse / can drop a PDF and an MP3; both appear in library.
2. Dropping `something.exe` is rejected.
3. Media picker Upload tab accepts non-images and refreshes selection list.

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/media/MediaUploader.tsx src/components/admin/media/picker/MediaUploadDropzone.tsx src/components/admin/media/picker/types.ts src/components/admin/media/picker/MediaPickerGrid.tsx
git commit -m "$(cat <<'EOF'
feat(media): use FilePond in library and picker

Route uploads through the shared component and process API.
EOF
)"
```

---

### Task 6: Avatar FilePond + crop + API upload

**Files:**
- Modify: `src/components/account/AvatarUploadField.tsx`

**Interfaces:**
- Keep props: `{ name, avatar, onChange, onRemove }`
- After crop, `POST /api/media/upload?purpose=avatar` with cropped JPEG blob, then `onChange(url)`

- [ ] **Step 1: Rewrite avatar field**

Keep the crop dialog UI. Change pick path to FilePond (`instantUpload={false}`, `allowMultiple={false}`, `purpose="avatar"`). On local file, open crop. On apply crop:

```ts
const blob: Blob = await new Promise((resolve, reject) => {
  canvas.toBlob(
    (b) => (b ? resolve(b) : reject(new Error('Crop failed'))),
    'image/jpeg',
    0.9
  )
})
const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' })
const formData = new FormData()
formData.append('filepond', file)
const res = await fetch('/api/media/upload?purpose=avatar', {
  method: 'POST',
  body: formData,
  credentials: 'include',
})
const data = await res.json()
if (!res.ok) throw new Error(data.error ?? 'Upload failed')
onChange(data.url)
```

Show a simple uploading/error state near the buttons. Keep Remove calling `onRemove`.

- [ ] **Step 2: Manual verification**

On account profile page: upload JPEG/PNG, crop, confirm avatar URL is an http(s)/CDN URL (not a giant `data:` URL). Reject a PDF selection in FilePond.

- [ ] **Step 3: Commit**

```bash
git add src/components/account/AvatarUploadField.tsx
git commit -m "$(cat <<'EOF'
feat(account): upload avatars via FilePond API

Crop locally then store avatar media under avatars/.
EOF
)"
```

---

### Task 7: Cursor skills

**Files:**
- Create: `.cursor/skills/media-upload/SKILL.md`
- Modify: `.cursor/skills/impeccable/reference/interaction-design.md` (short cross-link near forms/file UX)

- [ ] **Step 1: Write media-upload skill**

Create `.cursor/skills/media-upload/SKILL.md`:

```markdown
---
name: media-upload
description: >-
  Use FilePond and /api/media/upload for media and avatar uploads in this
  blog admin. Apply when adding or changing upload UI, MIME rules, or
  storage validation.
---

# Media Upload (FilePond)

## When to use

Any work that adds or changes file uploads in this repository (media library, media picker, avatar, or storage validation).

## Required pattern

1. Use `FilePondUpload` (`src/components/media/FilePondUpload.tsx`) — do not invent new dropzones.
2. Upload via `POST /api/media/upload` (FilePond `server.process`). Revert via `DELETE /api/media/upload`.
3. Media purpose: allow all MIME types except executables (`isBlockedExecutable` in `src/modules/media/executable-policy.ts`).
4. Avatar purpose: JPEG/PNG/WebP/GIF only; crop then upload; max 5MB.
5. Enforce the same rules in `src/lib/storage/minio.ts` — never reintroduce a broad MIME allow-list for media.

## Key files

- `src/components/media/FilePondUpload.tsx`
- `src/app/api/media/upload/route.ts`
- `src/modules/media/services/upload.ts`
- `src/modules/media/executable-policy.ts`
- Spec: `docs/superpowers/specs/2026-07-17-filepond-media-upload-design.md`
```

- [ ] **Step 2: Add Impeccable cross-link**

At the top of `.cursor/skills/impeccable/reference/interaction-design.md` (after the title), add:

```markdown
> **This project:** For file upload UX (media library, picker, avatar), follow the project skill `.cursor/skills/media-upload/SKILL.md` (FilePond + `/api/media/upload` + executable deny-list).
```

- [ ] **Step 3: Commit**

```bash
git add .cursor/skills/media-upload/SKILL.md .cursor/skills/impeccable/reference/interaction-design.md
git commit -m "$(cat <<'EOF'
docs(skills): document FilePond media upload pattern

Add media-upload skill and link it from Impeccable interaction design.
EOF
)"
```

---

### Task 8: Final verification

**Files:** none new

- [ ] **Step 1: Run full relevant test suite**

```bash
npm test -- __tests__/modules/media/executable-policy.test.js __tests__/lib/minio.test.js __tests__/api/media-upload.test.js
```

Expected: all PASS

- [ ] **Step 2: Typecheck / lint if available**

```bash
npm run lint
```

(or project equivalent). Fix any issues introduced by this work.

- [ ] **Step 3: Spec success-criteria check**

Confirm:

- [ ] Non-executable arbitrary MIME uploads work in library + picker
- [ ] Executables rejected client + server
- [ ] Avatar uses FilePond, image-only, cropped, URL from API
- [ ] `.cursor/skills/media-upload` + Impeccable note exist

- [ ] **Step 4: Final commit only if cleanup remains**

If only docs/typos remain:

```bash
git add -A
git status
git commit -m "$(cat <<'EOF'
chore(media): finish FilePond upload rollout cleanup
EOF
)"
```

Otherwise skip empty commit.

---

## Plan self-review

| Spec requirement | Task |
| --- | --- |
| All MIME except executables | 1, 2, 3 |
| FilePond on library + picker + avatar | 4, 5, 6 |
| Avatar JPEG/PNG/WebP/GIF + crop | 6 |
| `POST /api/media/upload` process API | 3, 4 |
| Revert DELETE | 3, 4 |
| Deny-list shared module | 1 |
| Skills + Impeccable note | 7 |
| Tests for policy, minio, route | 1, 2, 3, 8 |

No TBD placeholders. Interface names are consistent (`processMediaUpload`, `isBlockedExecutable`, `FilePondUpload`, `purpose`).
