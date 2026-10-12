'use client'
import { useEffect, useRef } from 'react'

const L = [[59,63,216],[11,118,110],[153,27,27],[4,120,87],[161,98,7],[91,33,182]] as const
const D = [[107,111,240],[45,212,191],[248,113,113],[52,211,153],[252,211,77],[167,139,250]] as const

// sx/sy = ellipse scale; different speeds and phases for organic, non-uniform motion
const BLOBS = [
  {ox:0.18,oy:0.40,amp:0.16,xS:0.00028,yS:0.00022,xP:0.0, yP:0.0, ci:0,sx:1.40,sy:0.75},
  {ox:0.70,oy:0.58,amp:0.18,xS:0.00022,yS:0.00031,xP:2.1, yP:1.3, ci:1,sx:0.80,sy:1.30},
  {ox:0.44,oy:0.20,amp:0.20,xS:0.00025,yS:0.00018,xP:4.4, yP:3.2, ci:2,sx:1.20,sy:0.85},
  {ox:0.12,oy:0.75,amp:0.13,xS:0.00030,yS:0.00024,xP:1.8, yP:4.6, ci:3,sx:0.70,sy:1.40},
  {ox:0.80,oy:0.28,amp:0.16,xS:0.00020,yS:0.00028,xP:3.6, yP:2.9, ci:4,sx:1.00,sy:0.80},
  {ox:0.54,oy:0.82,amp:0.15,xS:0.00026,yS:0.00020,xP:5.1, yP:0.7, ci:5,sx:1.30,sy:1.10},
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
    let t = 0

    function resize() {
      canvas!.width = hero.offsetWidth
      canvas!.height = hero.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(hero)

    function draw() {
      t++
      const w = canvas!.width, h = canvas!.height
      if (!w || !h) { raf = requestAnimationFrame(draw); return }
      ctx.clearRect(0, 0, w, h)

      const dark =
        document.documentElement.getAttribute('data-theme') === 'dark' ||
        (!document.documentElement.getAttribute('data-theme') &&
          window.matchMedia('(prefers-color-scheme:dark)').matches)
      const pal = dark ? D : L
      const baseAlpha = dark ? 0.12 : 0.15
      const baseR = Math.min(w, h) * (dark ? 0.42 : 0.46)

      // Faint grid — financial/data aesthetic
      const gA = dark ? 0.022 : 0.035
      ctx.strokeStyle = dark ? `rgba(130,140,200,${gA})` : `rgba(50,60,160,${gA})`
      ctx.lineWidth = 0.5
      for (let i = 1; i <= 8; i++) {
        const y = (h / 8) * i
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
      }
      for (let i = 1; i <= 10; i++) {
        const x = (w / 10) * i
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
      }

      // Elliptical blobs with breathing alpha
      for (const b of blobs) {
        b.xP += b.xS; b.yP += b.yS
        const cx = w * (b.ox + b.amp * Math.sin(b.xP))
        const cy = h * (b.oy + b.amp * Math.cos(b.yP))
        const sizeOsc = 0.82 + 0.18 * Math.sin(b.xP * 0.6 + t * 0.007)
        const alphaOsc = baseAlpha * (0.72 + 0.28 * Math.sin(b.yP * 1.4 + t * 0.005))
        const r = baseR * sizeOsc
        const sx = b.sx * (0.92 + 0.08 * Math.cos(b.xP * 0.3))
        const sy = b.sy * (0.92 + 0.08 * Math.sin(b.yP * 0.3))
        const [rr, gg, bb] = pal[b.ci]

        ctx.save()
        ctx.translate(cx, cy)
        ctx.scale(sx, sy)
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r)
        g.addColorStop(0,    `rgba(${rr},${gg},${bb},${alphaOsc})`)
        g.addColorStop(0.42, `rgba(${rr},${gg},${bb},${alphaOsc * 0.38})`)
        g.addColorStop(0.80, `rgba(${rr},${gg},${bb},${alphaOsc * 0.08})`)
        g.addColorStop(1,    `rgba(${rr},${gg},${bb},0)`)
        ctx.beginPath()
        ctx.arc(0, 0, r, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
        ctx.restore()
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
