import type { CollectionBeforeValidateHook } from 'payload'

import { APIError } from 'payload'
import { checkImageModeration } from '../../../lib/moderation/openaiModeration'

let warnedMissingKey = false

export const nsfwModeration: CollectionBeforeValidateHook = async ({ data, req }) => {
  const file = req.file

  if (!file) {
    return data
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    if (!warnedMissingKey) {
      req.payload.logger.warn(
        'OPENAI_API_KEY is not set — skipping NSFW moderation on media uploads.',
      )
      warnedMissingKey = true
    }
    return data
  }

  const result = await checkImageModeration(file.data, file.mimetype)

  if (result.error) {
    req.payload.logger.warn(`NSFW moderation check failed, allowing upload: ${result.error}`)
    return data
  }

  req.payload.logger.info(
    `NSFW moderation check for "${file.name}": flagged=${result.flagged} scores=${JSON.stringify(result.categoryScores ?? {})}`,
  )

  if (result.flagged || result.categories?.['sexual/minors']) {
    throw new APIError('Upload rejected: image failed content moderation (NSFW detected).', 400)
  }

  return data
}
