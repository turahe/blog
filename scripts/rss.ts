import { writeFileSync, mkdirSync } from 'fs'
import path from 'path'
import { slug } from 'github-slugger'
import { escape } from '@/lib/htmlEscaper'
import { getSiteMetadata } from '@/lib/site-metadata/get-site-metadata'
import type { SiteMetadata } from '@/lib/site-metadata/types'
import { getAllPosts, getTagCounts, sortPosts } from '@/services'

const outputFolder = 'public'

const generateRssItem = (
  config: SiteMetadata,
  post: { slug: string; title: string; summary?: string; date: string; tags: string[] }
) => `
  <item>
    <guid>${config.siteUrl}/blog/${post.slug}</guid>
    <title>${escape(post.title)}</title>
    <link>${config.siteUrl}/blog/${post.slug}</link>
    ${post.summary ? `<description>${escape(post.summary)}</description>` : ''}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${config.email} (${config.author})</author>
    ${post.tags?.map((t) => `<category>${t}</category>`).join('') || ''}
  </item>
`

const generateRss = (
  config: SiteMetadata,
  posts: { date: string; slug: string; title: string; summary?: string; tags: string[] }[],
  page = 'feed.xml'
) => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escape(config.title)}</title>
      <link>${config.siteUrl}/blog</link>
      <description>${escape(config.description)}</description>
      <language>${config.language}</language>
      <managingEditor>${config.email} (${config.author})</managingEditor>
      <webMaster>${config.email} (${config.author})</webMaster>
      <lastBuildDate>${posts.length > 0 ? new Date(posts[0].date).toUTCString() : new Date().toUTCString()}</lastBuildDate>
      <atom:link href="${config.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map((post) => generateRssItem(config, post)).join('')}
    </channel>
  </rss>
`

async function generateRSS() {
  const siteMetadata = await getSiteMetadata()
  const allPosts = sortPosts(await getAllPosts())
  const publishPosts = allPosts.filter((post) => post.draft !== true)
  const tagCounts = await getTagCounts()

  if (publishPosts.length > 0) {
    const rss = generateRss(siteMetadata, publishPosts)
    writeFileSync(`./${outputFolder}/feed.xml`, rss)
  }

  for (const tag of Object.keys(tagCounts)) {
    const filteredPosts = allPosts.filter((post) => post.tags.map((t) => slug(t)).includes(tag))
    if (filteredPosts.length === 0) continue
    const rss = generateRss(siteMetadata, filteredPosts, `tags/${tag}/feed.xml`)
    const rssPath = path.join(outputFolder, 'tags', tag)
    mkdirSync(rssPath, { recursive: true })
    writeFileSync(path.join(rssPath, 'feed.xml'), rss)
  }

  console.log('RSS feed generated...')
}

generateRSS().catch((error) => {
  console.error(error)
  process.exit(1)
})
