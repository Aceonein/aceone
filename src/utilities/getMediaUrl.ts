/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 *
 * Local paths (e.g. `/api/media/file/image.webp`) are kept relative so
 * Next.js image optimization treats them as local rather than fetching
 * through `remotePatterns`, which blocks private IPs since Next.js 16.
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  if (cacheTag && cacheTag !== '') {
    cacheTag = encodeURIComponent(cacheTag)
  }

  return cacheTag ? `${url}?${cacheTag}` : url
}

/**
 * Image src + object-position for a populated media doc. `updatedAt` is appended as a
 * version so an edited image (same filename) isn't served stale from browser/CDN caches.
 */
export const mediaImage = (media: any, size?: string): { src: string; objectPosition: string } => {
  const url = (size && media?.sizes?.[size]?.url) || media?.url
  return {
    src: getMediaUrl(url, media?.updatedAt),
    objectPosition: `${media?.focalX ?? 50}% ${media?.focalY ?? 50}%`,
  }
}
