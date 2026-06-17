import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import { MediaLibraryApp } from '@/components/admin/media/MediaLibraryApp'
import { listMedia, listFoldersWithPaths, listUploadAuthors } from '@/modules/media/services'
import { mediaFolderRepository } from '@/modules/media/repositories'
import { requirePermission } from '@/lib/rbac'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ folder?: string }>
}

export default async function AdminMediaPage({ searchParams }: PageProps) {
  await requirePermission('media.view')
  const params = await searchParams
  const folderId = params.folder ?? null

  const [mediaResult, folders, authors, breadcrumb] = await Promise.all([
    listMedia({
      page: 1,
      pageSize: 24,
      filters: folderId ? { folderId } : undefined,
    }),
    listFoldersWithPaths(),
    listUploadAuthors(),
    folderId ? mediaFolderRepository.getPath(folderId) : Promise.resolve([]),
  ])

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Media' }]} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white/90">Media Library</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Upload and manage images, videos, and documents.
        </p>
      </div>
      <MediaLibraryApp
        initialItems={mediaResult.data}
        initialTotal={mediaResult.total}
        folders={folders}
        authors={authors}
        initialFolderId={folderId}
        breadcrumb={breadcrumb.map((b) => ({ id: b.id, name: b.name }))}
      />
    </div>
  )
}
