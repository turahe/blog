import { z } from 'zod'

const settingGroupSchema = z.enum([
  'general',
  'appearance',
  'seo',
  'social',
  'navigation',
  'comments',
  'users',
  'integrations',
  'security',
  'advanced',
  'branding',
  'email',
  'storage',
  'features',
])
const optionalUrl = z.string().url().or(z.literal(''))
const optionalEmail = z.string().email().or(z.literal(''))

export const settingSchema = z.object({
  key: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9_.-]+$/),
  value: z.string().max(50000),
  type: z.enum(['string', 'number', 'boolean', 'json']).default('string'),
  group: settingGroupSchema.default('general'),
})

export const generalSettingsSchema = z.object({
  'site.name': z.string().min(1).max(120),
  'site.description': z.string().max(500),
  'site.url': z.string().url(),
  'site.admin_email': optionalEmail,
  'site.timezone': z.string().min(1).max(80),
  'site.language': z.string().min(2).max(10),
  'site.date_format': z.string().min(1).max(40),
})

export const appearanceSettingsSchema = z.object({
  'appearance.logo': z.string().max(2000),
  'appearance.favicon': z.string().max(2000),
  'appearance.primary_color': z.string().regex(/^#[0-9a-fA-F]{6}$/),
  'appearance.accent_color': z.string().regex(/^#[0-9a-fA-F]{6}$/),
  'appearance.border_radius': z.string().min(1).max(20),
  'appearance.font_family': z.string().min(1).max(80),
})

export const seoSettingsSchema = z.object({
  'seo.meta_title_template': z.string().min(1).max(120),
  'seo.meta_description': z.string().max(320),
  'seo.meta_keywords': z.string().max(500),
  'seo.og_image': z.string().max(2000),
  'seo.robots_txt': z.string().max(10000),
  'seo.sitemap_enabled': z.enum(['true', 'false']),
})

export const socialSettingsSchema = z.object({
  'social.facebook': optionalUrl,
  'social.twitter': optionalUrl,
  'social.instagram': optionalUrl,
  'social.linkedin': optionalUrl,
  'social.youtube': optionalUrl,
  'social.github': optionalUrl,
})

const menuItemSchema = z.object({
  id: z.string(),
  type: z.enum(['page', 'category', 'external']),
  label: z.string().min(1).max(80),
  href: z.string().min(1).max(500),
  categorySlug: z.string().optional(),
})

export const navigationSettingsSchema = z.object({
  'navigation.header': z.string().refine((v) => {
    try {
      menuItemSchema.array().parse(JSON.parse(v))
      return true
    } catch {
      return false
    }
  }, 'Invalid header menu JSON'),
  'navigation.footer': z.string().refine((v) => {
    try {
      menuItemSchema.array().parse(JSON.parse(v))
      return true
    } catch {
      return false
    }
  }, 'Invalid footer menu JSON'),
})

export const commentsSettingsSchema = z.object({
  'comments.enabled': z.enum(['true', 'false']),
  'comments.require_approval': z.enum(['true', 'false']),
  'comments.guest_enabled': z.enum(['true', 'false']),
  'comments.spam_protection': z.enum(['true', 'false']),
  'comments.moderation_level': z.enum(['low', 'medium', 'high']),
  'comments.akismet_key': z.string().max(200),
  'comments.limit_per_post': z.string().regex(/^\d+$/),
})

export const integrationsSettingsSchema = z.object({
  'integrations.ga_id': z.string().max(50),
  'integrations.gsc_verification': z.string().max(200),
  'integrations.gtm_id': z.string().max(50),
  'integrations.turnstile_site_key': z.string().max(200),
  'integrations.turnstile_secret_key': z.string().max(200),
  'integrations.smtp_host': z.string().max(200),
  'integrations.smtp_port': z.string().regex(/^\d+$/),
  'integrations.smtp_username': z.string().max(200),
  'integrations.smtp_password': z.string().max(200),
  'integrations.smtp_encryption': z.enum(['none', 'tls', 'ssl']),
})

export const securitySettingsSchema = z.object({
  'security.two_factor_enabled': z.enum(['true', 'false']),
  'security.session_timeout': z.string().regex(/^\d+$/),
  'security.password_min_length': z.string().regex(/^[6-9]\d*$/),
  'security.password_require_special': z.enum(['true', 'false']),
})

export const advancedSettingsSchema = z.object({
  'advanced.header_scripts': z.string().max(50000),
  'advanced.footer_scripts': z.string().max(50000),
  'advanced.custom_css': z.string().max(50000),
  'storage.driver': z.enum(['minio', 'r2', 'local']),
})

export const SECTION_SCHEMAS = {
  general: generalSettingsSchema,
  appearance: appearanceSettingsSchema,
  seo: seoSettingsSchema,
  social: socialSettingsSchema,
  navigation: navigationSettingsSchema,
  comments: commentsSettingsSchema,
  integrations: integrationsSettingsSchema,
  security: securitySettingsSchema,
  advanced: advancedSettingsSchema,
} as const

export const testEmailSchema = z.object({
  to: z.string().email(),
})
