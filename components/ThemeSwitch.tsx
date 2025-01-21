'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { motion } from "motion/react"
import useSound from 'use-sound'

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), [])

  const [ThemeSound] = useSound('/static/sounds/switch-on.mp3')
  const ThemeSwitch = () => {
    setTheme(theme === 'dark' || resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="ml-1 cursor-pointer rounded-full bg-zinc-300 ring-zinc-400 transition-all hover:bg-zinc-300 hover:ring-1 dark:bg-zinc-700 dark:ring-white dark:hover:bg-zinc-800">
      <motion.button
        className="flex h-8 w-8 items-center justify-center p-2"
        whileTap={{
          scale: 0.7,
          rotate: 360,
        }}
        whileHover={mounted ? { scale: 1.1 } : {}}
        transition={{ duration: 0.2, ease: 'easeIn' }}
        aria-label="Toggle Dark Mode"
        type="button"
        onClick={() => {
          ThemeSwitch()
          ThemeSound()
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          className="h-4 w-4 hover:animate-spin"
        >
          {mounted && (theme === 'dark' || resolvedTheme === 'dark') ? (
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          ) : (
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          )}
        </svg>
      </motion.button>
    </div>
  )
}

export default ThemeSwitch
