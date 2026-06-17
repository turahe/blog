import type { SettingRecord, SettingsSection } from '../types'

export const SETTINGS_DEFAULTS: SettingRecord[] = [
  // General
  { key: 'site.name', value: 'Wach Blog & Portfolio', type: 'string', group: 'general' },
  { key: 'site.author', value: 'Nur Wachid', type: 'string', group: 'general' },
  { key: 'site.header_title', value: 'Wachid', type: 'string', group: 'general' },
  {
    key: 'site.description',
    value:
      'Experienced programmer with in-depth knowledge of software development and coding. Proficient in designing, developing, and maintaining efficient and reliable software applications. Specialized in web development, mobile app development, data analysis and information security',
    type: 'string',
    group: 'general',
  },
  { key: 'site.url', value: 'https://wach.id', type: 'string', group: 'general' },
  { key: 'site.repo', value: 'https://github.com/turahe/blog', type: 'string', group: 'general' },
  { key: 'site.admin_email', value: 'nur@wach.id', type: 'string', group: 'general' },
  { key: 'site.timezone', value: 'Asia/Jakarta', type: 'string', group: 'general' },
  { key: 'site.language', value: 'id-id', type: 'string', group: 'general' },
  { key: 'site.locale', value: 'id-ID', type: 'string', group: 'general' },
  { key: 'site.date_format', value: 'MMMM d, yyyy', type: 'string', group: 'general' },

  // Appearance
  { key: 'appearance.logo', value: '/static/images/logo.png', type: 'string', group: 'appearance' },
  { key: 'appearance.theme', value: 'system', type: 'string', group: 'appearance' },
  {
    key: 'appearance.favicon',
    value: '/static/favicons/favicon.ico',
    type: 'string',
    group: 'appearance',
  },
  { key: 'appearance.primary_color', value: '#465fff', type: 'string', group: 'appearance' },
  { key: 'appearance.accent_color', value: '#12b76a', type: 'string', group: 'appearance' },
  { key: 'appearance.border_radius', value: '0.75rem', type: 'string', group: 'appearance' },
  { key: 'appearance.font_family', value: 'Inter', type: 'string', group: 'appearance' },

  // SEO
  {
    key: 'seo.meta_title_template',
    value: '%s | Wach Blog & Portfolio',
    type: 'string',
    group: 'seo',
  },
  {
    key: 'seo.meta_description',
    value: 'Experienced programmer with in-depth knowledge of software development and coding.',
    type: 'string',
    group: 'seo',
  },
  { key: 'seo.meta_keywords', value: 'blog,portfolio,tech', type: 'string', group: 'seo' },
  { key: 'seo.og_image', value: '/static/images/logo.png', type: 'string', group: 'seo' },
  { key: 'seo.robots_txt', value: 'User-agent: *\nAllow: /', type: 'string', group: 'seo' },
  { key: 'seo.sitemap_enabled', value: 'true', type: 'boolean', group: 'seo' },

  // Social
  {
    key: 'social.facebook',
    value: 'https://facebook.com/nur.wachid',
    type: 'string',
    group: 'social',
  },
  { key: 'social.twitter', value: 'https://twitter.com/wach_1', type: 'string', group: 'social' },
  { key: 'social.instagram', value: '', type: 'string', group: 'social' },
  {
    key: 'social.linkedin',
    value: 'https://www.linkedin.com/in/nur-wachid',
    type: 'string',
    group: 'social',
  },
  { key: 'social.youtube', value: 'https://youtube.com', type: 'string', group: 'social' },
  { key: 'social.github', value: 'https://github.com/turahe', type: 'string', group: 'social' },

  // Navigation (JSON)
  {
    key: 'navigation.header',
    value: JSON.stringify([
      { id: 'home', type: 'page', label: 'Home', href: '/' },
      { id: 'blog', type: 'page', label: 'Blog', href: '/blog' },
      { id: 'projects', type: 'page', label: 'Projects', href: '/projects' },
      { id: 'about', type: 'page', label: 'About', href: '/about' },
    ]),
    type: 'json',
    group: 'navigation',
  },
  {
    key: 'navigation.footer',
    value: JSON.stringify([
      { id: 'privacy', type: 'page', label: 'Privacy', href: '/privacy' },
      { id: 'terms', type: 'page', label: 'Terms', href: '/terms' },
    ]),
    type: 'json',
    group: 'navigation',
  },

  // Comments
  { key: 'comments.enabled', value: 'true', type: 'boolean', group: 'comments' },
  { key: 'comments.require_approval', value: 'true', type: 'boolean', group: 'comments' },
  { key: 'comments.guest_enabled', value: 'false', type: 'boolean', group: 'comments' },
  { key: 'comments.spam_protection', value: 'true', type: 'boolean', group: 'comments' },
  { key: 'comments.moderation_level', value: 'medium', type: 'string', group: 'comments' },
  { key: 'comments.akismet_key', value: '', type: 'string', group: 'comments' },
  { key: 'comments.limit_per_post', value: '100', type: 'number', group: 'comments' },

  // Integrations
  { key: 'integrations.ga_id', value: '', type: 'string', group: 'integrations' },
  {
    key: 'integrations.newsletter_provider',
    value: 'mailchimp',
    type: 'string',
    group: 'integrations',
  },
  { key: 'integrations.search_provider', value: 'cmdk', type: 'string', group: 'integrations' },
  { key: 'integrations.gsc_verification', value: '', type: 'string', group: 'integrations' },
  { key: 'integrations.gtm_id', value: '', type: 'string', group: 'integrations' },
  { key: 'integrations.turnstile_site_key', value: '', type: 'string', group: 'integrations' },
  { key: 'integrations.turnstile_secret_key', value: '', type: 'string', group: 'integrations' },
  { key: 'integrations.smtp_host', value: '', type: 'string', group: 'integrations' },
  { key: 'integrations.smtp_port', value: '587', type: 'number', group: 'integrations' },
  { key: 'integrations.smtp_username', value: '', type: 'string', group: 'integrations' },
  { key: 'integrations.smtp_password', value: '', type: 'string', group: 'integrations' },
  { key: 'integrations.smtp_encryption', value: 'tls', type: 'string', group: 'integrations' },

  // Security
  { key: 'security.two_factor_enabled', value: 'false', type: 'boolean', group: 'security' },
  { key: 'security.session_timeout', value: '1440', type: 'number', group: 'security' },
  { key: 'security.password_min_length', value: '8', type: 'number', group: 'security' },
  { key: 'security.password_require_special', value: 'true', type: 'boolean', group: 'security' },

  // Advanced
  { key: 'advanced.header_scripts', value: '', type: 'string', group: 'advanced' },
  { key: 'advanced.footer_scripts', value: '', type: 'string', group: 'advanced' },
  { key: 'advanced.custom_css', value: '', type: 'string', group: 'advanced' },

  // Storage
  { key: 'storage.driver', value: 'minio', type: 'string', group: 'storage' },
  {
    key: 'storage.minio.endpoint',
    value: 'http://localhost:9000',
    type: 'string',
    group: 'storage',
  },
  {
    key: 'storage.minio.public_url',
    value: 'http://localhost:9000',
    type: 'string',
    group: 'storage',
  },
  { key: 'storage.minio.bucket', value: 'blog-media', type: 'string', group: 'storage' },
  { key: 'storage.minio.region', value: 'us-east-1', type: 'string', group: 'storage' },
  { key: 'storage.minio.access_key', value: 'minioadmin', type: 'string', group: 'storage' },
  { key: 'storage.minio.secret_key', value: 'minioadmin', type: 'string', group: 'storage' },
  { key: 'storage.r2.account_id', value: '', type: 'string', group: 'storage' },
  { key: 'storage.r2.access_key_id', value: '', type: 'string', group: 'storage' },
  { key: 'storage.r2.secret_access_key', value: '', type: 'string', group: 'storage' },
  { key: 'storage.r2.bucket', value: 'blog-media', type: 'string', group: 'storage' },
  { key: 'storage.r2.public_url', value: '', type: 'string', group: 'storage' },
  { key: 'storage.r2.region', value: 'auto', type: 'string', group: 'storage' },
  { key: 'storage.r2.endpoint', value: '', type: 'string', group: 'storage' },
  { key: 'storage.mock.directory', value: '.mock-storage', type: 'string', group: 'storage' },
  {
    key: 'storage.mock.public_url',
    value: 'https://storage.mock.test',
    type: 'string',
    group: 'storage',
  },
  { key: 'storage.mock.bucket', value: 'blog-media', type: 'string', group: 'storage' },

  // Legacy keys (backward compatibility)
  { key: 'branding.logo', value: '/static/images/logo.png', type: 'string', group: 'appearance' },
  { key: 'email.from', value: 'noreply@example.com', type: 'string', group: 'integrations' },
  { key: 'features.comments', value: 'true', type: 'boolean', group: 'comments' },
]

export const SETTINGS_SECTION_META: Record<
  SettingsSection,
  { label: string; description: string }
> = {
  general: { label: 'General', description: 'Site identity, locale, and regional preferences.' },
  appearance: {
    label: 'Appearance',
    description: 'Branding, colors, typography, and theme preview.',
  },
  seo: { label: 'SEO', description: 'Search and social metadata defaults.' },
  social: {
    label: 'Social Media',
    description: 'Social profile links and Open Graph integration.',
  },
  navigation: { label: 'Navigation Menu', description: 'Header and footer menu structure.' },
  comments: { label: 'Comments', description: 'Comment moderation and spam protection.' },
  users: { label: 'Users & Roles', description: 'Role capabilities and permission overview.' },
  integrations: {
    label: 'Integrations',
    description: 'Analytics, email, and third-party services.',
  },
  security: { label: 'Security', description: 'Authentication policies and active sessions.' },
  storage: {
    label: 'Storage',
    description: 'Media upload driver and object storage configuration.',
  },
  advanced: { label: 'Advanced', description: 'Custom scripts and system information.' },
}

export const SETTINGS_NAV: { id: SettingsSection; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'seo', label: 'SEO' },
  { id: 'social', label: 'Social Media' },
  { id: 'navigation', label: 'Navigation Menu' },
  { id: 'comments', label: 'Comments' },
  { id: 'users', label: 'Users & Roles' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'security', label: 'Security' },
  { id: 'storage', label: 'Storage' },
  { id: 'advanced', label: 'Advanced' },
]
