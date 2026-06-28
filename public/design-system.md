# Aceone Design System

Token reference for the Aceone platform. Source of truth: `src/lib/ds.ts` + `globals.css`.

---

## Import

```ts
import { font, type as t, space, z, transition, layout } from '@/lib/ds'
```

Usage pattern:
```ts
<h1 style={{ ...t.displayLg, color: 'var(--ao-t1)', marginBottom: 20 }}>
  Market Intelligence, Distilled.
</h1>
```

---

## Fonts

| Token | Value |
|-------|-------|
| `font.sans` | `'var(--font-sans)'` → Space Grotesk |
| `font.mono` | `'var(--font-mono)'` → Space Mono |

---

## Color Tokens

All tokens are CSS custom properties on `:root` and `[data-theme='dark']`.

### Light mode

| Token | Value | Role |
|-------|-------|------|
| `--ao-bg` | `#f8f7f4` | Page background |
| `--ao-bg-2` | `#f0efe9` | Elevated background (chips, code blocks) |
| `--ao-bg-3` | `#e8e7e0` | Further elevated |
| `--ao-surface` | `#ffffff` | Card / modal surface |
| `--ao-border` | `#d4d3cc` | Primary border |
| `--ao-border-2` | `#b8b7af` | Secondary / decorative border |
| `--ao-border-ui` | `#a0a099` | UI control border |
| `--ao-t1` | `#0a0a08` | Primary text |
| `--ao-t2` | `#4a4a44` | Secondary text |
| `--ao-t3` | `#6a6960` | Tertiary / label text |
| `--ao-accent` | `#3B3FD8` | Brand accent (links, CTAs, highlights) |
| `--ao-accent-dim` | `rgba(59,63,216,0.08)` | Accent background tint |
| `--ao-nav-bg` | see globals.css | Header backdrop |
| `--ao-nav-h` | `56px` | Fixed header height |

### Dark mode

| Token | Value |
|-------|-------|
| `--ao-bg` | `#0a0a08` |
| `--ao-bg-2` | `#111110` |
| `--ao-bg-3` | `#1a1a18` |
| `--ao-surface` | `#161614` |
| `--ao-border` | `#2a2a26` |
| `--ao-border-2` | `#3a3a36` |
| `--ao-t1` | `#f0efe9` |
| `--ao-t2` | `#8c8b84` |
| `--ao-t3` | `#888880` |
| `--ao-accent` | `#6b6ff0` |
| `--ao-accent-dim` | `rgba(107,111,240,0.12)` |

### Category dots

| Token | Hex | Category |
|-------|-----|----------|
| `--ao-dot-pf` | `#3b82f6` | Personal Finance |
| `--ao-dot-inv` | `#22c55e` | Investing |
| `--ao-dot-mkt` | `#f59e0b` | Markets |
| `--ao-dot-pol` | `#a78bfa` | Policy |
| `--ao-dot-cry` | `#06b6d4` | Crypto |
| `--ao-dot-dd` | `#f97316` | Deep Dives |

---

## Typography Scale

### Mono presets (Space Mono, ALL CAPS — UI labels)

| Token | Size | Weight | Tracking | Transform | Use |
|-------|------|--------|----------|-----------|-----|
| `type.labelSm` | 8px | 400 | 0.08em | — | Tags, tiny badges |
| `type.label` | 9px | 700 | 0.16em | uppercase | Section eyebrows, stat labels |
| `type.meta` | 10px | 700 | 0.14em | uppercase | Filter headers, sidebar labels |
| `type.nav` | 11px | 700 | 0.1em | uppercase | Nav links, CTA buttons |
| `type.brand` | 12px | 700 | 0.18em | uppercase | Logo wordmark only |

### Sans presets (Space Grotesk — body copy)

| Token | Size | Weight | Line-height | Use |
|-------|------|--------|-------------|-----|
| `type.bodySm` | 13px | 300 | 1.65 | Card excerpts, secondary text |
| `type.body` | 15px | 300 | 1.72 | Brief body text, issue content |
| `type.bodyBase` | 16px | 400 | 1.72 | Brief subtitles, standard paragraphs |
| `type.bodyLg` | 17px | 300 | 1.72 | Article body, lead paragraphs |

### Sans presets — card / list titles

| Token | Size | Weight | Line-height | Use |
|-------|------|--------|-------------|-----|
| `type.listTitle` | 13px | 600 | 1.35 | Brief sidebar issue titles |
| `type.cardTitle` | 15px | 600 | 1.35 | Blog list view post titles |
| `type.itemTitle` | 17px | 600 | 1.3 | Blog card grid post titles |

### Sans presets — headings (fixed sizes)

| Token | Size | Weight | Line-height | Tracking | Use |
|-------|------|--------|-------------|----------|-----|
| `type.h4` | 19px | 700 | 1.3 | -0.01em | Minor prose headings |
| `type.h3` | 22px | 700 | 1.25 | -0.015em | Article subheadings |
| `type.h2` | 28px | 700 | 1.2 | -0.02em | Article major headings |
| `type.h2Sm` | 22px | 700 | 1.2 | -0.015em | Brief inline viewer headings |

### Sans presets — display / hero (responsive with clamp)

| Token | Size | Weight | Line-height | Tracking | Use |
|-------|------|--------|-------------|----------|-----|
| `type.displaySm` | clamp(28px, 3.5vw, 48px) | 700 | 1.08 | -0.025em | Brief issue h1 |
| `type.displayMd` | clamp(32px, 4vw, 52px) | 700 | 1.05 | -0.03em | Article page h1 |
| `type.displayLg` | clamp(32px, 4.5vw, 58px) | 700 | 1.05 | -0.03em | Brief hero h1 |
| `type.displayXl` | clamp(40px, 5.2vw, 72px) | 700 | 1.0 | -0.03em | Blog home hero h1 |

---

## Spacing Scale

JS: `space[key]` (number in px). CSS: `var(--ao-space-N)`.

| Token | JS | CSS |
|-------|----|-----|
| `space[1]` | 4 | `--ao-space-1` |
| `space[2]` | 8 | `--ao-space-2` |
| `space[3]` | 12 | `--ao-space-3` |
| `space[4]` | 16 | `--ao-space-4` |
| `space[5]` | 20 | `--ao-space-5` |
| `space[6]` | 24 | `--ao-space-6` |
| `space[7]` | 28 | `--ao-space-7` |
| `space[8]` | 32 | `--ao-space-8` |
| `space[10]` | 40 | `--ao-space-10` |
| `space[12]` | 48 | `--ao-space-12` |
| `space[14]` | 56 | `--ao-space-14` |
| `space[16]` | 64 | `--ao-space-16` |
| `space[20]` | 80 | — |

---

## Z-Index Scale

JS: `z.key`. CSS: `var(--ao-z-KEY)`.

| Token | Value | CSS | Use |
|-------|-------|-----|-----|
| `z.grain` | 9999 | `--ao-z-grain` | Grain overlay (`html::before`) |
| `z.header` | 1000 | `--ao-z-header` | Fixed header |
| `z.overlay` | 999 | `--ao-z-overlay` | Mobile menu, reading progress |
| `z.sticky` | 100 | `--ao-z-sticky` | Blog filter bar |
| `z.raised` | 50 | `--ao-z-raised` | Article breadcrumb |
| `z.above` | 10 | — | General above-content |
| `z.tab` | 2 | `--ao-z-tab` | Brief sidebar toggle tab |
| `z.base` | 1 | — | Base stacking |

---

## Transitions

JS: `transition.key`. CSS: `var(--ao-t-KEY)`.

| Token | Value | CSS |
|-------|-------|-----|
| `transition.fast` | `0.15s ease` | `--ao-t-fast` |
| `transition.base` | `0.18s ease` | `--ao-t-base` |
| `transition.slow` | `0.3s ease` | `--ao-t-slow` |
| `transition.xslow` | `0.4s ease` | `--ao-t-xslow` |

---

## Layout

| Token | Value |
|-------|-------|
| `layout.maxWidth` | `1280` |
| `layout.container` | `{ maxWidth: 1280, margin: '0 auto', width: '100%', boxSizing: 'border-box' }` |

---

## Usage Rules — When to Use Which Preset

| Token | Use when... |
|-------|-------------|
| `type.label` | Section eyebrows (Published, Category, Tags, Year, Month) |
| `type.meta` | Filter section headers, sidebar titles, stat labels |
| `type.nav` | All nav links, header CTA, mobile menu items |
| `type.brand` | Logo wordmark only (ACEONE/) |
| `type.body` | Brief issue body text, newsletter content |
| `type.bodyLg` | Article body paragraphs, lead text, excerpts |
| `type.bodySm` | Card excerpts (2-line clamp), secondary info |
| `type.listTitle` | Brief sidebar issue titles (sidebar is narrow) |
| `type.cardTitle` | Blog list view post titles |
| `type.itemTitle` | Blog card grid post titles |
| `type.h4` | Minor prose headings inside articles |
| `type.h3` | Article subheadings |
| `type.h2` | Article major headings, brief issue standalone h2 |
| `type.h2Sm` | Brief inline viewer headings (constrained panel) |
| `type.displaySm` | Brief issue standalone page h1 |
| `type.displayMd` | Article page h1 |
| `type.displayLg` | Brief archive hero h1 |
| `type.displayXl` | Blog home hero h1 |

---

## Files

| File | Purpose |
|------|---------|
| `src/lib/ds.ts` | JS/TS token exports — use in inline React styles |
| `src/app/(frontend)/globals.css` | CSS custom properties — use in CSS media queries |
| `src/app/(frontend)/design-system/page.tsx` | Live reference at `/design-system` |
| `public/design-system.html` | Standalone HTML reference (no Next.js required) |
| `public/design-system.md` | This file — markdown copy-paste reference |
