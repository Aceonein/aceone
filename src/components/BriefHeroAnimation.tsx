'use client'
import React from 'react'

// Waveform/signal-line animation — financial data aesthetic, different from HeroGeometric rings
const WAVES = [
  { color: 'var(--ao-hl-indigo)',    amp: 28, freq: 0.018, speed: 9,  phase: 0,    opacity: 0.55 },
  { color: 'var(--ao-hl-cobalt)',    amp: 18, freq: 0.025, speed: 13, phase: 1.8,  opacity: 0.38 },
  { color: 'var(--ao-hl-teal)',      amp: 36, freq: 0.012, speed: 17, phase: 3.4,  opacity: 0.30 },
  { color: 'var(--ao-hl-emerald)',   amp: 14, freq: 0.032, speed: 11, phase: 2.1,  opacity: 0.25 },
  { color: 'var(--ao-hl-amber)',     amp: 22, freq: 0.020, speed: 15, phase: 4.7,  opacity: 0.20 },
  { color: 'var(--ao-hl-crimson)',   amp: 10, freq: 0.038, speed: 7,  phase: 0.9,  opacity: 0.18 },
]

// Pre-compute SVG sine-wave path string for each wave
function sinePath(amp: number, freq: number, phase: number, w = 560, cy = 260): string {
  const pts: string[] = []
  for (let x = 0; x <= w; x += 4) {
    const y = cy + amp * Math.sin(freq * x + phase)
    pts.push(`${x},${y.toFixed(1)}`)
  }
  return 'M ' + pts.join(' L ')
}

export const BriefHeroAnimation: React.FC = () => (
  <div style={{
    position: 'absolute',
    left: 0, top: 0, bottom: 0, right: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
    maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 20%, black 50%, rgba(0,0,0,0.4) 80%, transparent 100%)',
    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 20%, black 50%, rgba(0,0,0,0.4) 80%, transparent 100%)',
  }}>
    <style>{`
      @keyframes ao-wave-drift {
        from { transform: translateX(0); }
        to   { transform: translateX(-140px); }
      }
      @keyframes ao-tick-blink {
        0%, 100% { opacity: 0.08; }
        50%       { opacity: 0.22; }
      }
      @media (prefers-reduced-motion: reduce) {
        .ao-wave, .ao-tick { animation: none !important; opacity: 0.12 !important; }
      }
    `}</style>

    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      viewBox="0 0 560 520"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Horizontal grid lines */}
      {[100, 160, 220, 260, 300, 360, 420].map((y, i) => (
        <line
          key={y}
          className="ao-tick"
          x1={0} y1={y} x2={560} y2={y}
          stroke="var(--ao-border-2)"
          strokeWidth={0.4}
          opacity={0.3}
          style={{ animation: `ao-tick-blink ${6 + i * 1.3}s ease-in-out infinite`, animationDelay: `${i * 0.6}s` }}
        />
      ))}

      {/* Vertical tick marks */}
      {[80, 160, 240, 320, 400, 480].map(x => (
        <line key={x} x1={x} y1={248} x2={x} y2={272} stroke="var(--ao-border-2)" strokeWidth={0.4} opacity={0.2} />
      ))}

      {/* Sine wave lines — each moves at different speed via translateX */}
      {WAVES.map((w, i) => (
        <g key={i} className="ao-wave" style={{ animation: `ao-wave-drift ${w.speed}s linear infinite` }}>
          {/* Render the wave twice side-by-side for seamless loop */}
          <path
            d={sinePath(w.amp, w.freq, w.phase)}
            fill="none"
            stroke={w.color}
            strokeWidth={i === 0 ? 1.4 : 0.8}
            opacity={w.opacity}
          />
          <path
            d={sinePath(w.amp, w.freq, w.phase, 560, 260).replace(/^M /, `M ${560},`).replace(/M \d+,/, `M 560,`)}
            fill="none"
            stroke={w.color}
            strokeWidth={i === 0 ? 1.4 : 0.8}
            opacity={w.opacity}
            transform="translate(560,0)"
          />
        </g>
      ))}

      {/* Pulse node on primary wave */}
      <circle cx={280} cy={260} r={3.5} fill="var(--ao-hl-indigo)" opacity={0.9} />
      <circle cx={280} cy={260} r={8}   fill="none" stroke="var(--ao-hl-indigo)" strokeWidth={0.8} opacity={0.4} />
      <circle cx={280} cy={260} r={16}  fill="none" stroke="var(--ao-hl-indigo)" strokeWidth={0.4} opacity={0.18} />

      {/* Y-axis labels */}
      {['+3%', '0', '-3%'].map((label, i) => (
        <text key={label} x={8} y={[180, 262, 344][i]} fontFamily="var(--font-mono)" fontSize={8} fill="var(--ao-border-2)" opacity={0.5} dominantBaseline="middle">{label}</text>
      ))}
    </svg>
  </div>
)
