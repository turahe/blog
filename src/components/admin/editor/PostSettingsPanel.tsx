'use client'

import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import { MediaImageField } from '@/components/admin/media/MediaImageField'

interface PostSettingsPanelProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>
  errors: FieldErrors
  authors: { id: string; fullName: string }[]
  tags: { id: string; name: string }[]
  categories: { id: string; name: string }[]
  defaultAuthorIds?: string[]
  defaultTagIds?: string[]
  featuredImage: string
  onFeaturedImageChange: (url: string) => void
}

export function PostSettingsPanel({
  register,
  errors,
  authors,
  tags,
  categories,
  defaultAuthorIds = [],
  defaultTagIds = [],
  featuredImage,
  onFeaturedImageChange,
}: PostSettingsPanelProps) {
  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h3 className="admin-section-title">Publish</h3>
        <div className="admin-field">
          <label htmlFor="post-date" className="admin-label">
            Date
          </label>
          <input id="post-date" type="date" {...register('date')} className="admin-input" />
        </div>
        <div className="admin-field">
          <label htmlFor="post-lastmod" className="admin-label">
            Last modified
          </label>
          <input id="post-lastmod" type="date" {...register('lastmod')} className="admin-input" />
        </div>
        <label className="admin-checkbox-label">
          <input type="checkbox" {...register('draft')} className="admin-checkbox" />
          Save as draft
        </label>
      </section>

      <section className="space-y-3">
        <h3 className="admin-section-title">URL</h3>
        <div className="admin-field">
          <label htmlFor="post-slug" className="admin-label">
            Slug
          </label>
          <input id="post-slug" {...register('slug')} className="admin-input" />
          {errors.slug && <p className="admin-error">{String(errors.slug.message)}</p>}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="admin-section-title">Taxonomy</h3>
        <div className="admin-field">
          <label htmlFor="post-category" className="admin-label">
            Category
          </label>
          <select id="post-category" {...register('categoryId')} className="admin-select">
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <fieldset className="admin-field">
          <legend className="admin-label">Authors</legend>
          <div className="flex flex-col gap-2">
            {authors.map((a) => (
              <label key={a.id} className="admin-checkbox-label">
                <input
                  type="checkbox"
                  value={a.id}
                  defaultChecked={defaultAuthorIds.includes(a.id)}
                  {...register('authorIds')}
                  className="admin-checkbox"
                />
                {a.fullName}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="admin-field">
          <legend className="admin-label">Tags</legend>
          <div className="flex max-h-40 flex-col gap-2 overflow-y-auto">
            {tags.map((t) => (
              <label key={t.id} className="admin-checkbox-label">
                <input
                  type="checkbox"
                  value={t.id}
                  defaultChecked={defaultTagIds.includes(t.id)}
                  {...register('tagIds')}
                  className="admin-checkbox"
                />
                {t.name}
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <section className="space-y-3">
        <h3 className="admin-section-title">Media & SEO</h3>
        <MediaImageField
          label="Featured image"
          value={featuredImage}
          onChange={onFeaturedImageChange}
          folder="posts"
          selectLabel="Select featured image"
          modalTitle="Featured Image"
        />
        <div className="admin-field">
          <label htmlFor="post-canonical-url" className="admin-label">
            Canonical URL
          </label>
          <input
            id="post-canonical-url"
            {...register('canonicalUrl')}
            className="admin-input"
            placeholder="https://..."
          />
        </div>
        <div className="admin-field">
          <label htmlFor="post-layout" className="admin-label">
            Layout
          </label>
          <input id="post-layout" {...register('layout')} className="admin-input" />
        </div>
      </section>
    </div>
  )
}
