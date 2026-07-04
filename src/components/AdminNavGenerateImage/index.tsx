'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

export default function AdminNavGenerateImage() {
  const pathname = usePathname()
  const active = pathname === '/admin/generate-image'

  return (
    <div style={{ padding: '0 16px', marginTop: 4 }}>
      <a
        href="/admin/generate-image"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 12px',
          fontSize: 13,
          fontWeight: 500,
          color: active ? '#8387f4' : 'var(--theme-text-dim, #8c8b84)',
          textDecoration: 'none',
          background: active ? 'var(--ao-accent-dim, rgba(107,111,240,0.1))' : 'transparent',
          borderLeft: active ? '2px solid #6b6ff0' : '2px solid transparent',
          letterSpacing: '0.01em',
          transition: 'color 150ms, background 150ms',
        }}
      >
        <span style={{ fontSize: 15, lineHeight: 1 }}>✦</span>
        Generate Image
      </a>
    </div>
  )
}
