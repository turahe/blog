# FilePond media upload (all MIME except executables)

**Date:** 2026-07-17  
**Status:** Approved for planning  
**Approach:** Dedicated FilePond process API (`/api/media/upload`)

## Goal

Replace custom media upload dropzones with FilePond across all upload surfaces, accept any MIME type except executables, and document the pattern in `.cursor/skills/`.

## Decisions (locked)

| Topic | Decision |
| --- | --- |
| File acceptance (media) | All MIME types except executables; keep 25MB max |
| FilePond placement | Media library, media picker, and avatar |
| Avatar content | JPEG / PNG / WebP / GIF only (FilePond UI + existing crop) |
| Upload transport | FilePond `server.process` → `POST /api/media/upload` (not server actions as the primary path) |
| Skills | New `.cursor/skills/media-upload/SKILL.md` + short Impeccable cross-link |

## Architecture

- **Packages:** `filepond`, `react-filepond`, FilePond core CSS; image preview plugin where useful (library/picker previews, avatar).
- **Shared UI:** `FilePondUpload` client component with props for accept mode (`media` deny-list vs `avatar` allow-list), max file size, multiple, folder context, and success/error callbacks.
- **API:** `POST /api/media/upload` for process; optional revert/`DELETE` for library removes.
- **Storage:** Existing MinIO/mock helpers; remove MIME allow-list; enforce executable deny-list; image variants only for non-SVG images.
- **Legacy:** `uploadMediaAction` becomes a thin shared helper used by the route, or is deprecated once the route owns creation + audit + revalidation.

## Components

### `FilePondUpload`

- Client-only wrapper around `react-filepond`.
- Modes:
  - `purpose="media"`: no MIME allow-list; client-side reject via shared `isBlockedExecutable()`.
  - `purpose="avatar"`: accept JPEG/PNG/WebP/GIF only.
- Wires FilePond `server.process` to `/api/media/upload` with credentials and optional `folderId` / `folderPath` / `purpose`.

### Call sites

- **Media library:** Replace `MediaUploader` drag/drop + hidden input with `FilePondUpload` (multiple).
- **Media picker upload tab:** Replace `MediaUploadDropzone` with `FilePondUpload`; on process success, pass media ids to `onUploadComplete`.
- **Avatar:** Replace hidden `<input type="file">` with FilePond (single file). Keep square-crop dialog. After crop, upload cropped JPEG blob via the same API (`purpose=avatar`, folder e.g. `avatars`) and call `onChange(url)` instead of embedding large data URLs when possible. Keep Remove behavior.

## Data flow

```
User selects file(s) in FilePond
  → client validates (size + deny-list or avatar allow-list)
  → POST /api/media/upload (multipart)
  → auth + permission
  → server validates again
  → uploadFileToMinio / uploadBufferToMinio
  → mediaRepository.create (always: library under folder path; avatar under `avatars`)
  → audit + revalidate (media library paths)
  → JSON response { id, url, ... } for FilePond
  → UI refreshes library / sets avatar URL
```

FilePond progress uses native XHR progress from the process endpoint.

### Revert

- Library: FilePond `server.revert` / `DELETE` removes the created media object (storage + DB) when the user removes a file from the pond before leaving the surface, if the file was just uploaded in that session.
- Avatar: revert optional; profile save remains the source of truth for which URL is attached to the user.

## API contract

### `POST /api/media/upload`

- **Auth:** Required session.
- **Permission:** `purpose=media` requires `media.upload`. `purpose=avatar` requires an authenticated session only (any signed-in user updating their own profile avatar), not `media.upload`.
- **Body:** Multipart; accept FilePond field name(s) (`filepond` and/or `file`).
- **Fields / query:** `folderId?`, `folderPath?`, `purpose?: "media" | "avatar"`.
- **Limits:** `MAX_FILE_BYTES` (25MB) for media; smaller avatar cap (e.g. 5MB) after crop.
- **Success:** `200` with JSON including at least `id` and `url` (FilePond can store the id as the server id).
- **Errors:** `400` validation, `401` unauthenticated, `403` forbidden, `413` too large if applicable.

### Revert / delete

- `DELETE /api/media/upload` or `DELETE /api/media/[id]` with the process response id, only for files the user is allowed to delete (`media.delete` or upload owner + `media.upload` — follow existing media delete rules).

## Executable deny-list

Shared module (e.g. `src/modules/media/executable-policy.ts`) used by client FilePond filters, API route, and storage upload helpers.

**Blocked extensions (case-insensitive):**  
`.exe`, `.dll`, `.so`, `.dylib`, `.bat`, `.cmd`, `.com`, `.msi`, `.scr`, `.ps1`, `.vbs`, `.wsf`, `.sh`, `.bash`, `.run`, `.app`, `.apk`, `.dmg`

**Blocked MIME types:**  
`application/x-msdownload`, `application/x-msdos-program`, `application/x-executable`, `application/x-sharedlib`, `application/x-mach-binary`, `application/vnd.microsoft.portable-executable`, and close aliases commonly used for PE/ELF binaries.

**Rules:**

- Reject if MIME **or** extension matches the deny-list.
- `application/octet-stream` / empty MIME: allow **unless** extension is blocked.
- Do **not** block general archives (zip/tar) or documents by default.
- Do **not** block JARs unless explicitly added later.

**Storage change:** Remove `ALLOWED_MIME_TYPES` enforcement from `uploadBufferToMinio` / `uploadFileToMinio`. Keep `ALLOWED_MIME_TYPES` only if still useful for UI filters/docs, or replace with deny-list exports + avatar allow-list constants. Update `MIME_FILTER_MAP` / type filters as needed so “All Files” remains accurate; unknown types still appear under All.

## Error handling

- Client: FilePond labels for invalid type/size before upload.
- Server: clear error strings; FilePond shows error state on non-2xx.
- Avatar: reject non-allowed image types before opening crop.

## Testing

- Unit tests for `isBlockedExecutable` / policy helpers (PDF, zip, mp3 allowed; `.exe` and PE MIME blocked; octet-stream + `.exe` blocked; octet-stream + `.pdf` allowed).
- Update `__tests__/lib/minio.test.js` (and related) for deny-list behavior instead of allow-list rejection of non-images.
- Route-level test: unauthenticated → 401; blocked executable → 400; happy path with mock storage if feasible.

## Skills updates

1. **New** `.cursor/skills/media-upload/SKILL.md`
   - When to use: any media/avatar upload work in this repo.
   - Require FilePond + `/api/media/upload`.
   - Document deny-list vs avatar allow-list.
   - Point to key files (`FilePondUpload`, API route, policy module).

2. **Impeccable** short note (e.g. in `reference/craft.md` or `reference/interaction-design.md`)
   - For upload UX in this project, follow the `media-upload` skill (FilePond + process API + executable deny-list).

## Out of scope

- Changing storage drivers or CDN behavior beyond MIME policy.
- Virus scanning / content disarm.
- Resumable/chunked uploads beyond what FilePond provides by default.
- Redesigning the media library grid beyond upload UI replacement.
- Blocking all scripts/archives (only executables as listed).

## Success criteria

- Users can upload non-executable files of any MIME in media library and picker.
- Executables (by MIME or extension) are rejected client- and server-side.
- Avatar uses FilePond, limited to JPEG/PNG/WebP/GIF, still crops, stores a URL from the upload API.
- Agents reading `.cursor/skills/` are steered to FilePond + the process API pattern.
