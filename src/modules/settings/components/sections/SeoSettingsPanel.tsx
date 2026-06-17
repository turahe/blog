'use client'

import Link from 'next/link'
import { SettingsCard } from '@/components/admin/settings/SettingsCard'
import { SettingsField } from '@/components/admin/settings/SettingsField'
import { ImageUploader } from '@/components/admin/settings/ImageUploader'
import { ToggleSwitch } from '@/components/admin/settings/ToggleSwitch'
import { generateSitemapAction } from '@/modules/settings/actions'
import { useSettingsSection } from '@/modules/settings/hooks/useSettingsSection'
import { useSettingsContext } from '@/components/admin/settings/SettingsContext'
import type { SettingsMap } from '@/modules/settings/types'

export function SeoSettingsPanel({
  initialValues,
  siteName,
  siteUrl,
}: {
  initialValues: SettingsMap
  siteName: string
  siteUrl: string
}) {
  const { values, update, setBool } = useSettingsSection('seo', initialValues)
  const { showToast } = useSettingsContext()

  const titleTemplate = values['seo.meta_title_template'] ?? '%s | Wach Blog'
  const description = values['seo.meta_description'] ?? ''
  const ogImage = values['seo.og_image'] ?? ''

  const previewTitle = titleTemplate.replace('%s', 'Sample Post Title')

  const handleSitemap = async () => {
    const result = await generateSitemapAction()
    if (result.success && result.data) {
      showToast(`Sitemap available at ${result.data.url}`)
    }
  }

  return (
    <>
      <SettingsCard
        title="Search metadata"
        description="Default titles and descriptions for search engines."
      >
        <SettingsField label="Meta title template" hint="Use %s for the page title.">
          <input
            className="admin-input"
            value={values['seo.meta_title_template'] ?? ''}
            onChange={(e) => update('seo.meta_title_template', e.target.value)}
          />
        </SettingsField>
        <SettingsField label="Meta description">
          <textarea
            className="admin-textarea"
            rows={3}
            value={description}
            onChange={(e) => update('seo.meta_description', e.target.value)}
          />
        </SettingsField>
        <SettingsField label="Meta keywords" hint="Comma-separated keywords.">
          <input
            className="admin-input"
            value={values['seo.meta_keywords'] ?? ''}
            onChange={(e) => update('seo.meta_keywords', e.target.value)}
          />
        </SettingsField>
        <ImageUploader
          label="Default Open Graph image"
          value={ogImage}
          onChange={(url) => update('seo.og_image', url)}
          folder="seo"
        />
      </SettingsCard>

      <SettingsCard title="Previews">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
            <p className="mb-2 text-xs font-medium text-gray-500 uppercase">Google preview</p>
            <p className="text-lg text-[#1a0dab] dark:text-[#8ab4f8]">{previewTitle}</p>
            <p className="text-sm text-[#006621] dark:text-[#81c995]">{siteUrl}/blog/sample-post</p>
            <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
              {description || 'Your meta description appears here.'}
            </p>
          </div>
          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
            <p className="border-b border-gray-200 px-4 py-2 text-xs font-medium text-gray-500 uppercase dark:border-gray-800">
              Open Graph
            </p>
            {ogImage ? (
              <img src={ogImage} alt="" className="aspect-[1.91/1] w-full object-cover" />
            ) : (
              <div className="flex aspect-[1.91/1] items-center justify-center bg-gray-100 text-sm text-gray-500 dark:bg-gray-900">
                No OG image
              </div>
            )}
            <div className="space-y-1 p-4">
              <p className="text-xs text-gray-500 uppercase">{siteName}</p>
              <p className="font-semibold text-gray-900 dark:text-white/90">{previewTitle}</p>
              <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>
            </div>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Advanced SEO">
        <ToggleSwitch
          label="Generate sitemap"
          description="Expose /sitemap.xml for crawlers."
          checked={values['seo.sitemap_enabled'] === 'true'}
          onChange={(c) => setBool('seo.sitemap_enabled', c)}
        />
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void handleSitemap()}
            className="admin-btn-secondary"
          >
            View sitemap
          </button>
          <Link href="/sitemap.xml" target="_blank" className="admin-btn-secondary">
            Open sitemap.xml
          </Link>
        </div>
        <SettingsField label="Robots.txt editor">
          <textarea
            className="admin-textarea font-mono text-sm"
            rows={8}
            value={values['seo.robots_txt'] ?? ''}
            onChange={(e) => update('seo.robots_txt', e.target.value)}
          />
        </SettingsField>
      </SettingsCard>
    </>
  )
}
