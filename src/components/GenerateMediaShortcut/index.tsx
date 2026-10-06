'use client'

import React from 'react'

export default function GenerateMediaShortcut() {
  return (
    <div className="ao-ai-shortcut">
      <a href="/admin/generate-image" className="ao-pill ao-pill--sm">
        <span aria-hidden="true">✦</span>
        Generate with AI instead
      </a>
    </div>
  )
}
