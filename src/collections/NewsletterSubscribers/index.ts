import type { CollectionConfig } from 'payload'
import { isAdmin } from '../../access/isAdmin'

export const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',
  access: {
    create: () => true, // public via API
    delete: isAdmin,
    read: ({ req: { user } }) => user?.role === 'admin' || (user as any)?.role === 'moderator',
    update: isAdmin,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'status', 'source', 'subscribedAt'],
    description: 'Newsletter subscribers',
    hidden: ({ user }) => (user as any)?.role !== 'admin',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
        { label: 'Bounced', value: 'bounced' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'source',
      type: 'select',
      options: [
        { label: 'Homepage Footer', value: 'homepage_footer' },
        { label: 'Aceone Brief Page', value: 'aceone_brief_page' },
        { label: 'Blog Article', value: 'blog_article' },
        { label: 'Unknown', value: 'unknown' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'consentNewsletter',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Consented to receive newsletter' },
    },
    {
      name: 'consentMarketing',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Consented to marketing emails' },
    },
    {
      name: 'subscribedAt',
      type: 'date',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'unsubscribedAt',
      type: 'date',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'lastEmailSentAt',
      type: 'date',
      admin: { readOnly: true },
    },
    {
      name: 'ipAddress',
      type: 'text',
      admin: { disabled: true },
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: { disabled: true },
    },
    {
      name: 'referrer',
      type: 'text',
      admin: { disabled: true },
    },
  ],
  timestamps: true,
}
