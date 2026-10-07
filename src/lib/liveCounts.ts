// Post pages are served from cache, so the numbers baked into the HTML go stale.
// These helpers count the visit once per session and fetch the current numbers.

type Counts = { views: number | null; upvotes: number | null }

const url = (slug: string) => `/api/posts/${encodeURIComponent(slug)}/view`
let tracking: Promise<void> | null = null
const reads = new Map<string, Promise<Counts>>()

export function trackView(slug: string): Promise<void> {
  if (tracking) return tracking
  try {
    if (sessionStorage.getItem(`ao:viewed:${slug}`)) return Promise.resolve()
    sessionStorage.setItem(`ao:viewed:${slug}`, '1')
  } catch {}
  tracking = fetch(url(slug), { method: 'POST', keepalive: true }).then(() => undefined, () => undefined)
  return tracking
}

// Waits one tick so a ViewTracker mounted on the same page can register its POST first.
export function getLiveCounts(slug: string): Promise<Counts> {
  let p = reads.get(slug)
  if (!p) {
    p = new Promise<void>((r) => setTimeout(r, 0))
      .then(() => tracking)
      .then(() => fetch(url(slug), { cache: 'no-store' }))
      .then((res) => (res.ok ? res.json() : { views: null, upvotes: null }))
      .then((d) => ({ views: typeof d.views === 'number' ? d.views : null, upvotes: typeof d.upvotes === 'number' ? d.upvotes : null }))
      .catch(() => ({ views: null, upvotes: null }))
    reads.set(slug, p)
  }
  return p
}
