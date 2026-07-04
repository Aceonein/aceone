'use client'

import React from 'react'

export default function GenerateMediaShortcut() {
  return (
    <div style={{ marginBottom: 8 }}>
      <a
        href="/admin/generate-image"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          padding: '7px 14px',
          background: 'transparent',
          border: '1px solid var(--theme-border-color, #2a2a26)',
          color: 'var(--theme-text-dim, #8c8b84)',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          borderRadius: 0,
          transition: 'all 150ms',
        }}
      >
        <span style={{ fontSize: 13 }}>✦</span>
        Generate with AI instead
      </a>
    </div>
  )
}
