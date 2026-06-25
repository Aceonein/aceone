'use client'
import React from 'react'

// Cycle through the full --ao-hl-* palette for rings and nodes
const HL = [
  'var(--ao-hl-indigo)',
  'var(--ao-hl-cobalt)',
  'var(--ao-hl-teal)',
  'var(--ao-hl-emerald)',
  'var(--ao-hl-amber)',
  'var(--ao-hl-crimson)',
  'var(--ao-hl-violet)',
  'var(--ao-hl-rose)',
  'var(--ao-hl-slate)',
  'var(--ao-hl-chartreuse)',
]

const RINGS   = [60, 120, 190, 265, 345, 430]
const NODES   = [[420,130],[480,180],[380,300],[450,350],[510,90],[490,420]] as [number,number][]

export const HeroGeometric: React.FC = () => (
  <div style={{
    position: 'absolute',
    right: 0, top: 0, bottom: 0,
    width: '58%',
    pointerEvents: 'none',
    overflow: 'hidden',
    maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 30%, black 65%)',
    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 30%, black 65%)',
  }}>
    <style>{`
      @keyframes ao-ring-pulse {
        0%, 100% { opacity: 0.08; }
        50%       { opacity: 0.30; }
      }
      @keyframes ao-scanline {
        0%   { transform: translateY(-2px); }
        100% { transform: translateY(520px); }
      }
      @keyframes ao-dot-drift {
        0%, 100% { opacity: 0.22; transform: translate(0, 0); }
        33%       { opacity: 0.55; transform: translate(1px, -2px); }
        66%       { opacity: 0.28; transform: translate(-1px, 1px); }
      }
      @media (prefers-reduced-motion: reduce) {
        .ao-geo-ring, .ao-geo-scan, .ao-geo-dot { animation: none !important; opacity: 0.15 !important; }
      }
    `}</style>

    {/* Dot grid */}
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: 'radial-gradient(circle, var(--ao-border-2) 1px, transparent 1px)',
      backgroundSize: '26px 26px',
      opacity: 0.5,
    }} />

    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      viewBox="0 0 620 520"
      preserveAspectRatio="xMaxYMid slice"
      aria-hidden="true"
    >
      {/* Concentric rings — each a different hl color */}
      {RINGS.map((r, i) => (
        <circle
          key={r}
          className="ao-geo-ring"
          cx={560} cy={260} r={r}
          fill="none"
          stroke={HL[i % HL.length]}
          strokeWidth={0.7}
          style={{
            animation: `ao-ring-pulse ${5 + i * 1.4}s ease-in-out infinite`,
            animationDelay: `${i * 0.7}s`,
          }}
        />
      ))}

      {/* Structural diagonal lines */}
      <line x1="220" y1="0"   x2="620" y2="220" stroke="var(--ao-border-2)" strokeWidth={0.5} opacity={0.4} />
      <line x1="340" y1="0"   x2="620" y2="130" stroke="var(--ao-border-2)" strokeWidth={0.4} opacity={0.22} />
      <line x1="220" y1="520" x2="620" y2="300" stroke="var(--ao-border-2)" strokeWidth={0.5} opacity={0.4} />
      <line x1="340" y1="520" x2="620" y2="390" stroke="var(--ao-border-2)" strokeWidth={0.4} opacity={0.22} />

      {/* Crosshair at focal point — accent indigo */}
      <line x1="540" y1="260" x2="580" y2="260" stroke={HL[0]} strokeWidth={0.9} opacity={0.7} />
      <line x1="560" y1="240" x2="560" y2="280" stroke={HL[0]} strokeWidth={0.9} opacity={0.7} />
      <circle cx={560} cy={260} r={2.5} fill={HL[0]} opacity={0.9} />
      <circle cx={560} cy={260} r={7}   fill="none" stroke={HL[0]} strokeWidth={0.8} opacity={0.45} />

      {/* Node dots — each a different hl color */}
      {NODES.map(([x, y], i) => (
        <circle
          key={i}
          className="ao-geo-dot"
          cx={x} cy={y} r={2.2}
          fill={HL[(i + 2) % HL.length]}
          style={{
            animation: `ao-dot-drift ${6 + i * 1.1}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}

      {/* Scanline — teal */}
      <rect
        className="ao-geo-scan"
        x={0} y={0} width={620} height={1.5}
        fill={HL[2]}
        opacity={0.3}
        style={{ animation: 'ao-scanline 7s linear infinite' }}
      />
    </svg>
  </div>
)
