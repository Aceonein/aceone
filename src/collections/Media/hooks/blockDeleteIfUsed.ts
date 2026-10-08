import { APIError, type CollectionBeforeDeleteHook } from 'payload'

// Collections (and globals) that can point at a media file, directly or inside rich text.
const SCANNED = ['posts', 'aceone-briefs', 'authors', 'categories', 'pages', 'globals']

// Walks any value (relationship ids, nested blocks, Lexical JSON) looking for the media id.
function mentions(value: unknown, id: string): boolean {
  if (value == null) return false
  if (typeof value === 'string') return value === id
  if (typeof value === 'object') {
    const v = value as any
    if (typeof v.toHexString === 'function') return v.toHexString() === id // ObjectId
    if (v instanceof Date) return false
    return Object.values(v).some((x) => mentions(x, id))
  }
  return false
}

/**
 * Deleting a media doc also deletes its files from the bucket, so a post still using it would show a
 * broken image. Refuse the delete and say where it's used. Rare admin action, so a full scan is fine.
 */
export const blockDeleteIfUsed: CollectionBeforeDeleteHook = async ({ id, req }) => {
  if ((req as any).context?.skipUsageCheck) return

  const db = (req.payload.db as any).connection.db
  const mediaId = String(id)
  const usedBy: string[] = []

  for (const name of SCANNED) {
    const docs = await db.collection(name).find({}).toArray()
    for (const d of docs) {
      const { _id, ...rest } = d
      if (mentions(rest, mediaId)) usedBy.push(`${name}: ${d.title || d.name || d.slug || String(_id)}`)
    }
  }

  if (usedBy.length) {
    const shown = usedBy.slice(0, 5).join('; ')
    const more = usedBy.length > 5 ? ` and ${usedBy.length - 5} more` : ''
    throw new APIError(
      `Can't delete: this image is still used by ${shown}${more}. Replace or remove it there first.`,
      409,
      undefined,
      true,
    )
  }
}
