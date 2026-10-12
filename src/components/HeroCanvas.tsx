'use client'
import { useEffect, useRef } from 'react'

const L = [[59,63,216],[11,118,110],[153,27,27],[4,120,87],[161,98,7],[91,33,182]] as const
const D = [[107,111,240],[45,212,191],[248,113,113],[52,211,153],[252,211,77],[167,139,250]] as const

const BLOBS = [
  {ox:0.22,oy:0.38,amp:0.16,xS:0.00021,yS:0.00017,xP:0.0,yP:0.0,ci:0},
  {ox:0.72,oy:0.62,amp:0.14,xS:0.00016,yS:0.00023,xP:2.1,yP:1.3,ci:1},
  {ox:0.48,oy:0.22,amp:0.18,xS:0.00019,yS:0.00014,xP:4.4,yP:3.2,ci:2},
  {ox:0.14,oy:0.72,amp:0.12,xS:0.00024,yS:0.00019,xP:1.8,yP:4.6,ci:3},
  {ox:0.82,oy:0.28,amp:0.15,xS:0.00015,yS:0.00022,xP:3.6,yP:2.9,ci:4},
  {ox:0.55,oy:0.78,amp:0.13,xS:0.00020,yS:0.00016,xP:5.1,yP:0.7,ci:5},
]

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const hero = canvas.closest('.hp-hero') as HTMLElement

    const blobs = BLOBS.map(b => ({ ...b }))
    let raf: number

    function resize() {
      canvas!.width = hero.offsetWidth
      canvas!.height = hero.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(hero)

    function draw() {
      const w = canvas!.width, h = canvas!.height
      if (!w || !h) { raf = requestAnimationFrame(draw); return }
      ctx.clearRect(0, 0, w, h)
      const dark =
        document.documentElement.getAttribute('data-theme') === 'dark' ||
        (!document.documentElement.getAttribute('data-theme') &&
          window.matchMedia('(prefers-color-scheme:dark)').matches)
      const pal = dark ? D : L
      const alpha = dark ? 0.09 : 0.13
      const baseR = Math.min(w, h) * (dark ? 0.38 : 0.44)
      for (const b of blobs) {
        b.xP += b.xS; b.yP += b.yS
        const x = w * (b.ox + b.amp * Math.sin(b.xP))
        const y = h * (b.oy + b.amp * Math.cos(b.yP))
        const r = baseR * (0.85 + 0.15 * Math.sin(b.xP * 0.7))
        const [rr, gg, bb] = pal[b.ci]
        const g = ctx.createRadialGradient(x, y, 0, x, y, r)
        g.addColorStop(0,    `rgba(${rr},${gg},${bb},${alpha})`)
        g.addColorStop(0.45, `rgba(${rr},${gg},${bb},${alpha * 0.38})`)
        g.addColorStop(1,    `rgba(${rr},${gg},${bb},0)`)
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    function onVisibility() {
      if (document.hidden) cancelAnimationFrame(raf)
      else raf = requestAnimationFrame(draw)
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} id="hp-canvas" aria-hidden="true" />
}
