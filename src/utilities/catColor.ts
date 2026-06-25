const HL: Record<string, string> = {
  indigo:     'var(--ao-hl-indigo)',
  cobalt:     'var(--ao-hl-cobalt)',
  teal:       'var(--ao-hl-teal)',
  emerald:    'var(--ao-hl-emerald)',
  amber:      'var(--ao-hl-amber)',
  crimson:    'var(--ao-hl-crimson)',
  violet:     'var(--ao-hl-violet)',
  rose:       'var(--ao-hl-rose)',
  slate:      'var(--ao-hl-slate)',
  chartreuse: 'var(--ao-hl-chartreuse)',
}

export function catColor(key?: string | null): string {
  return HL[key ?? ''] ?? HL.indigo
}
