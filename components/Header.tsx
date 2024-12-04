'use client'

import siteMetadata from '@/utils/siteMetadata'
import headerNavLinks from '@/utils/headerNavLinks'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import Typewriter from 'typewriter-effect'
import { usePathname } from 'next/navigation'

const Header = () => {
    const pathname = usePathname()
    return (
        <header className="flex items-center justify-between py-10">
            <div>
                <Link href="/" aria-label={siteMetadata.headerTitle}>
                    <div className="text-primary-color dark:text-primary-color-dark flex items-center justify-between text-xl font-semibold">
                        {`~${pathname}`}{' '}
                        <Typewriter
                            options={{
                                strings: [],
                                autoStart: true,
                                loop: true,
                            }}
                        />
                    </div>
                </Link>
            </div>
            <div className="flex items-center leading-5 space-x-4 sm:space-x-6">
                {headerNavLinks
                    .filter((link) => link.href !== '/')
                    .map((link) => (
                        <Link
                            key={link.title}
                            href={link.href}
                            className="hidden sm:block font-medium text-gray-900 dark:text-gray-100"
                        >
                            {link.title}
                        </Link>
                    ))}
                <ThemeSwitch />
                <MobileNav />
            </div>
        </header>
    )
}

export default Header
