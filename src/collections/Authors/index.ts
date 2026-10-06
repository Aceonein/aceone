import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'

import { isAdmin } from '../../access/isAdmin'

const AUTHOR_PHOTOS_FOLDER = 'Author Photos'

const filePhotoInFolder: CollectionAfterChangeHook = async ({ doc, previousDoc, req }) => {
  const id = typeof doc.profileImage === 'object' ? doc.profileImage?.id : doc.profileImage
  const prev = typeof previousDoc?.profileImage === 'object' ? previousDoc.profileImage?.id : previousDoc?.profileImage
  if (!id || id === prev) return doc

  const { payload } = req
  const found = await payload.find({
    collection: 'payload-folders' as any,
    where: { name: { equals: AUTHOR_PHOTOS_FOLDER } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  })
  const folder =
    found.docs[0] ??
    (await payload.create({
      collection: 'payload-folders' as any,
      data: { name: AUTHOR_PHOTOS_FOLDER, folderType: ['media'] } as any,
      overrideAccess: true,
      req,
    }))

  await payload.update({
    collection: 'media',
    id,
    data: { _folder: folder.id } as any,
    overrideAccess: true,
    context: { skipNsfwCheck: true, disableRevalidate: true },
    req,
  })
  return doc
}

export const Authors: CollectionConfig = {
  slug: 'authors',
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: () => true,
    update: ({ req: { user } }) =>
      user?.role === 'admin' || (user as any)?.role === 'moderator',
  },
  hooks: { afterChange: [filePhotoInFolder] },
  admin: {
    group: 'People',
    useAsTitle: 'name',
    defaultColumns: ['name', 'designation', 'updatedAt'],
    hidden: ({ user }) => (user as any)?.role === 'author',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'designation',
      type: 'text',
      required: true,
      admin: { description: 'e.g. Senior Financial Analyst' },
    },
    {
      name: 'title',
      type: 'text',
      admin: { description: 'e.g. Dr., CFA (optional)' },
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: { description: 'Max 500 characters' },
    },
    {
      name: 'expertise',
      type: 'array',
      fields: [{ name: 'area', type: 'text', required: true }],
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'twitter',
      type: 'text',
      admin: { description: 'Username only (no @)' },
    },
    {
      name: 'linkedin',
      type: 'text',
      admin: { description: 'Full profile URL' },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Linked user account (one profile per user)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar' },
      hooks: {
        beforeValidate: [
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (args: any) => {
            const { value, data } = args
            if (data?.name && !value) {
              return data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '')
            }
            return value
          },
        ],
      },
    },
  ],
  timestamps: true,
}
