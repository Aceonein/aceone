import type { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { authenticated } from '../../access/authenticated'
import { nsfwModeration } from './hooks/nsfwModeration'

export const Media: CollectionConfig = {
  slug: 'media',
  folders: true,
  admin: { useAsTitle: 'title', listSearchableFields: ['title', 'filename', 'alt'] },
  access: {
    create: authenticated,
    delete: ({ req: { user } }) =>
      user?.role === 'admin' || (user as any)?.role === 'moderator',
    read: () => true,
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin' || (user as any).role === 'moderator') return true
      return { createdBy: { equals: user.id } }
    },
  },
  hooks: {
    beforeOperation: [nsfwModeration],
    beforeChange: [
      ({ data, req, operation }) => {
        if (operation === 'create' && req.user) data.createdBy = req.user.id
        return data
      },
    ],
    afterChange: [
      ({ doc, operation, req: { context } }) => {
        // Edited image keeps its filename/URL; refresh cached pages so the new version-tagged URL is served
        if (operation === 'update' && !context.disableRevalidate) revalidatePath('/', 'layout')
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { disabled: true },
      access: { update: () => false },
    },
    {
      name: 'generateMediaShortcut',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/GenerateMediaShortcut',
        },
      },
    },
    {
      name: 'title',
      type: 'text',
      admin: { description: 'Display name for finding this image in the library. Does not change the file name or URL.' },
      hooks: {
        // Images uploaded before titles existed fall back to their file name
        afterRead: [({ value, siblingData }) => value || siblingData?.filename],
      },
    },
    {
      name: 'alt',
      type: 'text',
      admin: { description: 'Describes the image for accessibility. New uploads are also named after this text.' },
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        formatOptions: { format: 'webp', options: { quality: 75 } },
      },
      {
        name: 'square',
        width: 500,
        height: 500,
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'small',
        width: 600,
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'medium',
        width: 900,
        formatOptions: { format: 'webp', options: { quality: 82 } },
      },
      {
        name: 'large',
        width: 1400,
        formatOptions: { format: 'webp', options: { quality: 85 } },
      },
      {
        name: 'xlarge',
        width: 1920,
        formatOptions: { format: 'webp', options: { quality: 85 } },
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
        formatOptions: { format: 'webp', options: { quality: 85 } },
      },
    ],
  },
}
