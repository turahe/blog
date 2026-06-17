import Link from 'next/link'
import { getSiteMetadata } from '@/lib/site-metadata/get-site-metadata'

interface AuthBrandPanelProps {
  title?: string
  description?: string
}

export async function AuthBrandPanel({
  title = 'Manage your content with confidence',
  description = 'A secure workspace for publishing, administration, and site operations.',
}: AuthBrandPanelProps) {
  const siteMetadata = await getSiteMetadata()
  return (
    <div className="relative hidden overflow-hidden bg-gray-950 lg:flex lg:w-[44%] xl:w-[42%]">
      <div
        className="absolute inset-0 opacity-90"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 20% 20%, oklch(0.45 0.18 350 / 0.45), transparent 55%), radial-gradient(ellipse 70% 50% at 80% 80%, oklch(0.35 0.12 280 / 0.35), transparent 50%), linear-gradient(160deg, oklch(0.18 0.03 260) 0%, oklch(0.13 0.028 261) 100%)',
        }}
      />
      <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 text-white transition-opacity hover:opacity-90"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-sm font-bold ring-1 ring-white/20 backdrop-blur-sm">
              W
            </span>
            <span className="text-lg font-semibold tracking-tight">{siteMetadata.headerTitle}</span>
          </Link>
        </div>

        <div className="max-w-md space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight text-white xl:text-4xl">{title}</h2>
          <p className="text-base leading-relaxed text-gray-400">{description}</p>
        </div>

        <p className="text-xs text-gray-500">
          &copy; {new Date().getFullYear()} {siteMetadata.author}. All rights reserved.
        </p>
      </div>
    </div>
  )
}
