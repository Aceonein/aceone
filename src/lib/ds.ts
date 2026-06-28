// Aceone Design System — single source of truth for all inline style constants

export const font = {
  sans: 'var(--font-sans)',
  mono: 'var(--font-mono)',
} as const

// Typography presets — spread into style objects:
//   { ...type.label, color: 'var(--ao-t3)' }
export const type = {
  // ── UI / meta (mono, uppercase) ──────────────────────────────────
  labelSm:   { fontFamily: 'var(--font-mono)', fontSize: 8,  fontWeight: 400, letterSpacing: '0.08em' },
  label:     { fontFamily: 'var(--font-mono)', fontSize: 9,  fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const },
  meta:      { fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const },
  nav:       { fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',  textTransform: 'uppercase' as const },
  brand:     { fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const },

  // ── Body copy (sans) ─────────────────────────────────────────────
  bodySm:    { fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 300, lineHeight: 1.65 },
  body:      { fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 300, lineHeight: 1.72 },
  bodyBase:  { fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 400, lineHeight: 1.72 },
  bodyLg:    { fontFamily: 'var(--font-sans)', fontSize: 17, fontWeight: 300, lineHeight: 1.72 },

  // ── Card / list titles (sans) ─────────────────────────────────────
  listTitle: { fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, lineHeight: 1.35 },
  cardTitle: { fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600, lineHeight: 1.35 },
  itemTitle: { fontFamily: 'var(--font-sans)', fontSize: 17, fontWeight: 600, lineHeight: 1.3  },

  // ── Prose headings (sans, fixed sizes) ───────────────────────────
  h4:        { fontFamily: 'var(--font-sans)', fontSize: 19, fontWeight: 700, lineHeight: 1.3,  letterSpacing: '-0.01em'  },
  h3:        { fontFamily: 'var(--font-sans)', fontSize: 22, fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.015em' },
  h2:        { fontFamily: 'var(--font-sans)', fontSize: 28, fontWeight: 700, lineHeight: 1.2,  letterSpacing: '-0.02em'  },
  // Smaller h2 for constrained panels (brief inline viewer)
  h2Sm:      { fontFamily: 'var(--font-sans)', fontSize: 22, fontWeight: 700, lineHeight: 1.2,  letterSpacing: '-0.015em' },

  // ── Display / hero (clamp for viewport scaling) ───────────────────
  displaySm: { fontFamily: 'var(--font-sans)', fontSize: 'clamp(28px,3.5vw,48px)' as string & number, fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.025em' },
  displayMd: { fontFamily: 'var(--font-sans)', fontSize: 'clamp(32px,4vw,52px)'   as string & number, fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.03em'  },
  displayLg: { fontFamily: 'var(--font-sans)', fontSize: 'clamp(32px,4.5vw,58px)' as string & number, fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.03em'  },
  displayXl: { fontFamily: 'var(--font-sans)', fontSize: 'clamp(40px,5.2vw,72px)' as string & number, fontWeight: 700, lineHeight: 1.0,  letterSpacing: '-0.03em'  },
} as const

// Spacing scale (px values)
export const space = {
  1:  4,
  2:  8,
  3:  12,
  4:  16,
  5:  20,
  6:  24,
  7:  28,
  8:  32,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
} as const

// Z-index scale
export const z = {
  grain:   9999,
  header:  1000,
  overlay: 999,
  sticky:  100,
  raised:  50,
  above:   10,
  tab:     2,
  base:    1,
} as const

// Transition presets
export const transition = {
  fast:  '0.15s ease',
  base:  '0.18s ease',
  slow:  '0.3s ease',
  xslow: '0.4s ease',
} as const

// Layout constants
export const layout = {
  maxWidth:  1280,
  container: { maxWidth: 1280, margin: '0 auto', width: '100%', boxSizing: 'border-box' as const },
} as const
