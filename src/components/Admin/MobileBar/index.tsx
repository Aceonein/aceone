'use client'

import { useNav } from '@payloadcms/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const I = (props: { children: React.ReactNode }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {props.children}
  </svg>
)

// Phone/tablet bottom navigation. Portalled to <body> so it works even while the sidebar drawer is closed.
export default function MobileBar() {
  const pathname = usePathname() ?? ''
  const { navOpen, setNavOpen } = useNav()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted || navOpen) return null // hide behind the open menu drawer

  const is = (p: string) => (p === '/admin' ? pathname === '/admin' : pathname.startsWith(p))

  return createPortal(
    <nav className="ao-tabbar" aria-label="Primary">
      <Link href="/admin" className="ao-tabbar__item" aria-current={is('/admin') ? 'page' : undefined}>
        <I><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></I>
        <span>Home</span>
      </Link>
      <Link href="/admin/collections/posts" className="ao-tabbar__item" aria-current={is('/admin/collections/posts') && !pathname.endsWith('/create') ? 'page' : undefined}>
        <I><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8" /></I>
        <span>Posts</span>
      </Link>
      <Link href="/admin/collections/posts/create" className="ao-tabbar__new" aria-label="New post">
        <I><path d="M12 5v14M5 12h14" /></I>
      </Link>
      <Link href="/admin/collections/media" className="ao-tabbar__item" aria-current={is('/admin/collections/media') ? 'page' : undefined}>
        <I><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" /></I>
        <span>Media</span>
      </Link>
      <button type="button" className="ao-tabbar__item" onClick={() => setNavOpen(true)} aria-label="Open menu">
        <I><path d="M4 7h16M4 12h16M4 17h16" /></I>
        <span>Menu</span>
      </button>
    </nav>,
    document.body,
  )
}
