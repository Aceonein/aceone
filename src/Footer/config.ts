import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'brandTagline',
      type: 'text',
      defaultValue: 'The financially literate friend that young Indians never had.',
    },
    {
      name: 'copyrightText',
      type: 'text',
      defaultValue: '© 2026 Aceone · Anti-Debt. Pro-Decision.',
    },
    {
      name: 'columns',
      type: 'array',
      maxRows: 4,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
        },
        {
          name: 'links',
          type: 'array',
          fields: [
            link({ appearances: false }),
          ],
          admin: {
            initCollapsed: true,
          },
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      maxRows: 5,
      admin: {
        initCollapsed: true,
      },
      fields: [
        { name: 'platform', type: 'select', options: ['Twitter / X', 'LinkedIn', 'YouTube', 'Instagram', 'GitHub'], required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
