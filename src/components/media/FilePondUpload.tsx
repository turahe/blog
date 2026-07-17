'use client'

import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import { useEffect, useRef } from 'react'
import type { FilePond as FilePondInstance } from 'react-filepond'
import { FilePond, registerPlugin } from 'react-filepond'
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
  /** Imperative browse for toolbar buttons */
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

  const accepted = purpose === 'avatar' ? [...AVATAR_ALLOWED_MIME_TYPES] : undefined
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
            return purpose !== 'avatar'
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
