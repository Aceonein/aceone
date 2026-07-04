import type { CollectionConfig } from 'payload'
import { isAdmin } from '../../access/isAdmin'
import { slugField } from 'payload'
import { defaultLexical } from '@/fields/defaultLexical'
import { convertRichTextToEmailHTML, stripHTML } from '@/lib/email/rich-text-to-html'

export const AceoneBriefs: CollectionConfig = {
  slug: 'aceone-briefs',
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: () => true,
    update: isAdmin,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', 'status', 'sentAt'],
    description: 'The Aceone Brief — Weekly newsletter issues',
    hidden: ({ user }) => (user as any)?.role !== 'admin',
    livePreview: {
      url: () =>
        `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/brief`,
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'Newsletter title (shown on web archive page)' },
    },
    {
      name: 'issueNumber',
      type: 'number',
      admin: { position: 'sidebar', description: 'Issue number (e.g. 1, 2, 3…)' },
    },
    {
      name: 'content',
      type: 'richText',
      editor: defaultLexical,
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: { description: '16:9 ratio, 1200x675px recommended' },
    },
    {
      name: 'generateCoverImage',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/GenerateImageField#GenerateImageField',
        },
        custom: { targetField: 'coverImage' },
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Sunday publication date',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'emailSubject',
      type: 'text',
      required: true,
      admin: { description: 'Email subject line (50-60 chars optimal)' },
    },
    {
      name: 'emailPreviewText',
      type: 'text',
      required: true,
      maxLength: 140,
      admin: { description: 'Preview text in inbox (max 140 chars)' },
    },
    {
      name: 'tags',
      type: 'array',
      admin: { description: 'Tags for this issue' },
      fields: [{ name: 'tag', type: 'text', required: true }],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Sent', value: 'sent' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Scheduled = will auto-send on publishedAt date',
      },
    },
    // Auto-generated fields (read-only)
    {
      name: 'htmlEmailContent',
      type: 'code',
      admin: {
        language: 'html',
        readOnly: true,
        description: 'Auto-generated email HTML (do not edit)',
      },
    },
    {
      name: 'plainTextContent',
      type: 'textarea',
      admin: { readOnly: true, description: 'Auto-generated plain text version' },
    },
    // Analytics (auto-populated after send)
    {
      name: 'sentAt',
      type: 'date',
      admin: { position: 'sidebar', readOnly: true, description: 'When email was sent' },
    },
    {
      name: 'recipientCount',
      type: 'number',
      admin: { position: 'sidebar', readOnly: true, description: 'Subscribers at send time' },
    },
    slugField(),
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        // Auto-generate email HTML when status is scheduled or sent
        if (data.status === 'scheduled' || data.status === 'sent') {
          let coverImageUrl = ''
          if (data.coverImage) {
            const mediaId = typeof data.coverImage === 'object' ? data.coverImage.id : data.coverImage
            try {
              const media = await req.payload.findByID({ collection: 'media', id: mediaId })
              coverImageUrl = (media as any)?.url || ''
            } catch {
              // continue without image
            }
          }
          data.htmlEmailContent = await convertRichTextToEmailHTML(data.content, coverImageUrl)
          data.plainTextContent = stripHTML(data.htmlEmailContent)
        }

        return data
      },
    ],
  },
}
