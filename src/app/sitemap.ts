import { MetadataRoute } from 'next'
import { getAllPosts, getCategoriesWithCounts, getAuthorsWithPosts, getTagCounts } from '@/services'
import { getSiteMetadata } from '@/lib/site-metadata/get-site-metadata'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { siteUrl } = await getSiteMetadata()
  const [posts, categories, authors, tagCounts] = await Promise.all([
    getAllPosts(),
    getCategoriesWithCounts(),
    getAuthorsWithPosts(),
    getTagCounts(),
  ])

  const staticRoutes = ['', 'blog', 'search', 'projects', 'tags', 'github', 'about'].map(
    (route) => ({
      url: `${siteUrl}/${route}`,
      lastModified: new Date(),
    })
  )

  const blogRoutes = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.lastmod || post.date),
  }))

  const categoryRoutes = categories.map((c) => ({
    url: `${siteUrl}/category/${c.slug}`,
    lastModified: new Date(),
  }))

  const authorRoutes = authors.map((a) => ({
    url: `${siteUrl}/author/${a.slug}`,
    lastModified: new Date(),
  }))

  const tagRoutes = Object.keys(tagCounts).map((tag) => ({
    url: `${siteUrl}/tags/${tag}`,
    lastModified: new Date(),
  }))

  return [...staticRoutes, ...blogRoutes, ...categoryRoutes, ...authorRoutes, ...tagRoutes]
}
