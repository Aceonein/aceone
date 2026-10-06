'use client'

import { useNav, useTheme } from '@payloadcms/ui'
import React, { useEffect } from 'react'

const Sun = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 1.5v1.6M8 12.9v1.6M1.5 8h1.6M12.9 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const Moon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M13.5 9.6A5.7 5.7 0 0 1 6.4 2.5a5.7 5.7 0 1 0 7.1 7.1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
)

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { navOpen, setNavOpen } = useNav()

  // Desktop shows the sidebar permanently (see admin.scss); keep Payload's nav state in step
  // so the nav groups render expanded instead of collapsed behind a hidden toggle.
  useEffect(() => {
    if (!navOpen && window.matchMedia('(min-width: 1025px)').matches) setNavOpen(true)
  }, [navOpen, setNavOpen])

  return (
    <div className="ao-theme" role="group" aria-label="Colour theme">
      <button type="button" className="ao-theme__btn" aria-pressed={theme === 'light'} aria-label="Light theme" onClick={() => setTheme('light')}>
        <Sun />
      </button>
      <button type="button" className="ao-theme__btn" aria-pressed={theme === 'dark'} aria-label="Dark theme" onClick={() => setTheme('dark')}>
        <Moon />
      </button>
    </div>
  )
}
