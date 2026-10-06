import type { CollectionBeforeOperationHook } from 'payload'

import sharp from 'sharp'
import { APIError } from 'payload'
import { checkImageModeration } from '../../../lib/moderation/openaiModeration'

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
const MAX_BYTES = 10 * 1024 * 1024 // 10MB
const MAX_DIMENSION = 2400 // cap width/height before storing original

const slugify = (text: string) =>
  text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/, '')

// Name a new upload after its alt text (SEO-friendly) and default its admin title.
function nameFromAlt(args: any, file: { name: string }, operation: string) {
  if (operation !== 'create') return
  const alt = typeof args.data?.alt === 'string' ? args.data.alt.trim() : ''
  const ext = file.name.match(/\.[^.]+$/)?.[0] ?? ''
  const base = file.name.replace(/\.[^.]+$/, '')
  const slug = slugify(alt)
  if (slug) file.name = `${slug}${ext}`
  if (args.data && !args.data.title) args.data.title = alt || base
}

// Runs as beforeOperation: Payload builds the stored file and its name from req.file
// *before* beforeValidate hooks, so conversion/rename must happen here to take effect.
export const nsfwModeration: CollectionBeforeOperationHook = async ({ args, operation, req }) => {
  const file = req.file

  if (!file) {
    return args
  }

  // AI-generated images skip moderation — DALL-E enforces content safety upstream
  if ((req as any).context?.skipNsfwCheck) {
    nameFromAlt(args, file, operation)
    return args
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new APIError(
      'Media uploads are disabled: OPENAI_API_KEY not configured. Contact an admin.',
      503,
    )
  }

  if (!ALLOWED_MIMES.includes(file.mimetype)) {
    throw new APIError(`File type "${file.mimetype}" is not allowed. Only images accepted.`, 400)
  }

  if (file.size > MAX_BYTES) {
    throw new APIError('File too large. Maximum size is 10MB.', 413)
  }

  const result = await checkImageModeration(file.data, file.mimetype)

  if (result.error) {
    if (result.rateLimited) {
      req.payload.logger.warn(`NSFW moderation rate limited by OpenAI — allowing upload: ${file.name}`)
    } else {
      throw new APIError(`Upload rejected: content moderation check failed (${result.error})`, 503)
    }
  }

  req.payload.logger.info(
    `NSFW check for "${file.name}": flagged=${result.flagged} scores=${JSON.stringify(result.categoryScores ?? {})}`,
  )

  if (result.flagged || result.categories?.['sexual/minors']) {
    throw new APIError('Upload rejected: image failed content moderation (NSFW detected).', 400)
  }

  // GIFs skip conversion — Sharp flattens animation
  if (file.mimetype !== 'image/gif') {
    const optimised = await sharp(file.data)
      .rotate() // auto-rotate from EXIF orientation, then strip EXIF
      .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85, effort: 4 })
      .toBuffer({ resolveWithObject: true })

    file.data = optimised.data
    file.size = optimised.info.size
    file.mimetype = 'image/webp'
    file.name = file.name.replace(/\.[^.]+$/, '.webp')
  }

  nameFromAlt(args, file, operation)
  return args
}
