import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { isAdmin } from '../../access/isAdmin'
import { canEditPost, canReadPost } from '../../access/canEditPost'
import { authenticated } from '../../access/authenticated'

import { Paragraph } from '../../blocks/Paragraph/config'
import { Heading } from '../../blocks/Heading/config'
import { RichTextBlock } from '../../blocks/RichTextBlock/config'
import { ImageBlock } from '../../blocks/ImageBlock/config'
import { OrderedList } from '../../blocks/OrderedList/config'
import { UnorderedList } from '../../blocks/UnorderedList/config'
import { PullQuote } from '../../blocks/PullQuote/config'
import { DataBox } from '../../blocks/DataBox/config'
import { Table } from '../../blocks/Table/config'
import { SectionMarker } from '../../blocks/SectionMarker/config'
import { Spacer } from '../../blocks/Spacer/config'
import { Disclaimer } from '../../blocks/Disclaimer/config'
import { Accordion } from '../../blocks/Accordion/config'

import { revalidatePost, revalidateDelete } from './hooks/revalidatePost'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Posts: CollectionConfig<'posts'> = {
  slug: 'posts',
  access: {
    create: authenticated,
    delete: isAdmin,
    read: canReadPost,
    update: canEditPost,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    categories: true,
    meta: { image: true, description: true },
  },
  admin: {
    defaultColumns: ['title', 'status', 'author', 'updatedAt'],
    useAsTitle: 'title',
    livePreview: {
      url: ({ data }) => {
        const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
        const previewSecret = process.env.PREVIEW_SECRET
        return `${baseURL}/next/preview?path=/posts/${data?.slug}&previewSecret=${previewSecret}`
      },
    },
    components: {
      edit: {
        beforeDocumentControls: ['@/components/PostWorkflow'],
      },
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      minLength: 10,
      maxLength: 120,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'excerpt',
              type: 'textarea',
              required: true,
              maxLength: 300,
              admin: { description: 'Brief summary shown on listing pages (max 300 chars)' },
            },
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'featuredImageAlt',
              type: 'text',
              required: true,
              admin: { description: 'Alt text for accessibility' },
            },
            {
              name: 'content',
              type: 'blocks',
              required: true,
              minRows: 1,
              blocks: [
                Paragraph,
                Heading,
                RichTextBlock,
                ImageBlock,
                OrderedList,
                UnorderedList,
                PullQuote,
                DataBox,
                Table,
                SectionMarker,
                Spacer,
                Disclaimer,
                Accordion,
              ],
            },
          ],
        },
        {
          label: 'Meta',
          fields: [
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
              required: true,
              minRows: 1,
              admin: { position: 'sidebar' },
            },
            {
              name: 'tags',
              type: 'relationship',
              relationTo: 'tags',
              hasMany: true,
              admin: { position: 'sidebar' },
            },
            {
              name: 'relatedPosts',
              type: 'relationship',
              relationTo: 'posts',
              hasMany: true,
              filterOptions: ({ id }) => ({ id: { not_in: [id] } }),
              admin: { description: 'Manual override for related posts' },
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({ titlePath: 'meta.title', descriptionPath: 'meta.description', imagePath: 'meta.image' }),
            MetaTitleField({ hasGenerateFn: true }),
            MetaImageField({ relationTo: 'media' }),
            MetaDescriptionField({}),
            PreviewField({ hasGenerateFn: true, titlePath: 'meta.title', descriptionPath: 'meta.description' }),
          ],
        },
      ],
    },
    // Sidebar fields
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'In Review', value: 'review' },
        { label: 'Approved', value: 'approved' },
        { label: 'Published', value: 'published' },
      ],
      access: {
        // Authors cannot directly edit status — they use the workflow bar
        update: ({ req: { user } }) =>
          (user as any)?.role === 'admin' || (user as any)?.role === 'moderator',
      },
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
        readOnly: true,
        description: 'Auto-set when published',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'readTime',
      type: 'number',
      admin: { position: 'sidebar', readOnly: true, description: 'Auto-calculated (min read)' },
    },
    {
      name: 'views',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'upvotes',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'upvotedBy',
      type: 'array',
      admin: { disabled: true },
      fields: [{ name: 'ip', type: 'text' }],
    },
    // Which user created this post — used for author-level access control
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { disabled: true },
      access: { update: () => false },
    },
    {
      name: 'editRequests',
      type: 'array',
      admin: { position: 'sidebar', description: 'Edit requests for published posts' },
      fields: [
        { name: 'requestedBy', type: 'relationship', relationTo: 'users' },
        { name: 'requestDate', type: 'date' },
        { name: 'reason', type: 'textarea', required: true },
        {
          name: 'urgency',
          type: 'select',
          defaultValue: 'medium',
          options: [
            { label: 'Low', value: 'low' },
            { label: 'Medium', value: 'medium' },
            { label: 'High', value: 'high' },
          ],
        },
        {
          name: 'requestStatus',
          type: 'select',
          defaultValue: 'pending',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Approved', value: 'approved' },
            { label: 'Rejected', value: 'rejected' },
          ],
        },
      ],
    },
    slugField(),
  ],
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        // Auto-set createdBy on first create
        if (operation === 'create' && req.user) {
          data.createdBy = req.user.id
        }

        // Auto-set publishedAt when status changes to published
        if (data.status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }

        // Enforce status transition by role
        const user = req.user as any
        if (user && operation === 'update') {
          if (data.status === 'published' && user.role !== 'admin') {
            delete data.status
          }
          if (data.status === 'approved' && user.role === 'author') {
            delete data.status
          }
        }

        return data
      },
    ],
    afterChange: [revalidatePost],
    afterDelete: [revalidateDelete],
  },
}
