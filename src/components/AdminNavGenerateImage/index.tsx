'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

export default function AdminNavGenerateImage() {
  const pathname = usePathname()
  const active = pathname === '/admin/generate-image'

  return (
    <div className="ao-nav-extra">
      <a href="/admin/generate-image" className={`nav__link${active ? ' active' : ''}`} aria-current={active ? 'page' : undefined}>
        <span className="nav__link-label">Generate image</span>
      </a>
    </div>
  )
}
