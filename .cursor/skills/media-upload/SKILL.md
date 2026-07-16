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
