'use client'
import { useEffect } from 'react'

export function RevealInit() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const els = document.querySelectorAll<HTMLElement>('.hp-reveal')
    els.forEach(el => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(16px)'
    })
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return
          const delay = parseInt((e.target as HTMLElement).dataset.delay ?? '0')
          setTimeout(() => {
            ;(e.target as HTMLElement).style.opacity = '1'
            ;(e.target as HTMLElement).style.transform = 'translateY(0)'
          }, delay)
          io.unobserve(e.target)
        })
      },
      { threshold: 0.08 },
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  return null
}
