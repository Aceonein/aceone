import type { CollectionBeforeValidateHook, PayloadRequest } from 'payload'

export async function ownAuthorProfileId(req: PayloadRequest): Promise<string | undefined> {
  if (!req.user) return undefined
  try {
    const res = await req.payload.find({
      collection: 'authors',
      where: { user: { equals: req.user.id } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
      req,
    })
    return res.docs[0]?.id ? String(res.docs[0].id) : undefined
  } catch {
    return undefined
  }
}

export const defaultAuthorToCreator: CollectionBeforeValidateHook = async ({ data, req, operation }) => {
  if (operation === 'create' && data && !data.author) {
    const id = await ownAuthorProfileId(req)
    if (id) data.author = id
  }
  return data
}
