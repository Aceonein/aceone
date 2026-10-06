'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const KEY = 'ao:nav-collapsed'
const TIP_TARGETS = '.nav .nav__link, .nav .browse-by-folder-button, .nav .ao-brand__new, .nav .ao-collapse'

type Tip = { text: string; top: number; left: number } | null

// Collapse button under the logo + tooltips. The tooltip is a fixed-position portal so the
// sidebar's overflow clipping can't cut it off.
export default function NavCollapse() {
  const [collapsed, setCollapsed] = useState(false)
  const [tip, setTip] = useState<Tip>(null)

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(KEY) === '1')
    } catch {}
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-nav', collapsed ? 'collapsed' : 'open')
  }, [collapsed])

  const toggle = useCallback(() => {
    setCollapsed((v) => {
      const next = !v
      try {
        localStorage.setItem(KEY, next ? '1' : '0')
      } catch {}
      return next
    })
    setTip(null)
  }, [])

  // Tooltips: always for the collapse button, and for every nav item while the rail is collapsed.
  useEffect(() => {
    const show = (e: Event) => {
      const el = (e.target as HTMLElement | null)?.closest?.(TIP_TARGETS) as HTMLElement | null
      if (!el) return
      const isToggle = el.classList.contains('ao-collapse')
      if (!isToggle && document.documentElement.getAttribute('data-nav') !== 'collapsed') return
      const text = el.getAttribute('data-tip') || el.getAttribute('aria-label') || el.textContent?.trim() || ''
      if (!text) return
      const r = el.getBoundingClientRect()
      setTip({ text, top: r.top + r.height / 2, left: r.right + 12 })
    }
    const hide = () => setTip(null)
    document.addEventListener('mouseover', show)
    document.addEventListener('focusin', show)
    document.addEventListener('mouseout', hide)
    document.addEventListener('focusout', hide)
    return () => {
      document.removeEventListener('mouseover', show)
      document.removeEventListener('focusin', show)
      document.removeEventListener('mouseout', hide)
      document.removeEventListener('focusout', hide)
    }
  }, [])

  const label = collapsed ? 'Expand sidebar' : 'Collapse sidebar'

  return (
    <>
      <button type="button" className="ao-collapse" onClick={toggle} aria-label={label} data-tip={label} aria-expanded={!collapsed}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="3" />
          <path d="M9 4v16" />
          <path d={collapsed ? 'm14 10 2 2-2 2' : 'm16 10-2 2 2 2'} />
        </svg>
      </button>
      {tip &&
        createPortal(
          <div className="ao-tip" role="tooltip" style={{ top: tip.top, left: tip.left }}>
            {tip.text}
          </div>,
          document.body,
        )}
    </>
  )
}
