'use client'

import React, { useEffect, useState } from 'react'

export function ReadingProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setPct(total > 0 ? (scrolled / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{
      position: 'fixed', top: 'var(--ao-nav-h)', left: 0, right: 0, zIndex: 999,
      height: 2, background: 'var(--ao-border)',
    }}>
      <div style={{
        height: '100%', background: 'var(--ao-accent)',
        width: `${pct}%`, transition: 'width 0.1s linear',
      }} />
    </div>
  )
}
