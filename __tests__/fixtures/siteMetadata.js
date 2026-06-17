/** @type {import('@/lib/site-metadata').SiteMetadata} */
const mockSiteMetadata = {
  title: 'Wach Blog & Portfolio',
  author: 'Nur Wachid',
  headerTitle: 'Wachid',
  description: 'Experienced programmer with in-depth knowledge of software development and coding.',
  language: 'id-id',
  theme: 'system',
  siteUrl: 'https://wach.id',
  siteRepo: 'https://github.com/turahe/blog',
  siteLogo: '/static/images/logo.png',
  socialBanner: '/static/images/logo.png',
  email: 'nur@wach.id',
  github: 'https://github.com/turahe',
  twitter: 'https://twitter.com/wach_1',
  facebook: 'https://facebook.com/nur.wachid',
  youtube: 'https://youtube.com',
  linkedin: 'https://www.linkedin.com/in/nur-wachid',
  locale: 'id-ID',
  analytics: {
    umamiAnalytics: {
      umamiWebsiteId: 'test-id',
      src: 'https://analytics.example.com',
    },
  },
  newsletter: {
    provider: 'mailchimp',
  },
  comments: {
    enabled: true,
    requireApproval: true,
    guestEnabled: false,
  },
  search: {
    provider: 'cmdk',
    searchConfig: {
      searchDocumentsPath: 'search.json',
    },
  },
}

module.exports = { mockSiteMetadata }
