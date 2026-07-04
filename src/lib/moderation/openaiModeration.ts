interface ModerationResult {
  flagged: boolean
  categories?: Record<string, boolean>
  categoryScores?: Record<string, number>
  error?: string
}

export async function checkImageModeration(
  buffer: Buffer,
  mimetype: string,
): Promise<ModerationResult> {
  const apiKey = process.env.OPENAI_API_KEY

  try {
    const dataUrl = `data:${mimetype};base64,${buffer.toString('base64')}`

    const response = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'omni-moderation-latest',
        input: [{ type: 'image_url', image_url: { url: dataUrl } }],
      }),
    })

    if (!response.ok) {
      return { flagged: false, error: `OpenAI moderation API returned ${response.status}` }
    }

    const json = await response.json()
    const result = json?.results?.[0]

    return {
      flagged: Boolean(result?.flagged),
      categories: result?.categories,
      categoryScores: result?.category_scores,
    }
  } catch (err) {
    return {
      flagged: false,
      error: err instanceof Error ? err.message : 'Unknown error calling OpenAI moderation API',
    }
  }
}
