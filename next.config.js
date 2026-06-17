// You might need to insert additional domains in script-src if you are using external services
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' analytics.umami.is analytics.wach.id va.vercel-scripts.com;
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  media-src 'self' data: blob: *.s3.amazonaws.com;
  connect-src *;
  font-src 'self';
  frame-src 'self'
`

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

const basePath = process.env.BASE_PATH || undefined

function getR2ImagePattern() {
  const publicUrl = process.env.R2_PUBLIC_URL
  if (!publicUrl) return null

  try {
    const { protocol, hostname } = new URL(publicUrl)
    return {
      protocol: protocol.replace(':', ''),
      hostname,
      pathname: '/**',
    }
  } catch {
    return null
  }
}

const r2ImagePattern = getR2ImagePattern()

/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
module.exports = {
  basePath,
  reactStrictMode: true,
  trailingSlash: false,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    // Required for Docker/local MinIO (private IPs) during development and E2E.
    dangerouslyAllowLocalIP:
      process.env.NODE_ENV === 'development' || process.env.ALLOW_LOCAL_IMAGE_IP === 'true',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/blog-media/**',
      },
      {
        protocol: 'http',
        hostname: 'minio',
        port: '9000',
        pathname: '/blog-media/**',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.wach.id',
        pathname: '/**',
      },
      ...(r2ImagePattern ? [r2ImagePattern] : []),
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}
