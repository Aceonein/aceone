import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  admin: {
    hidden: ({ user }) => (user as any)?.role === 'author',
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        {
          name: 'type',
          type: 'select',
          defaultValue: 'text',
          required: true,
          options: [
            { label: 'Text link', value: 'text' },
            { label: 'CTA button', value: 'cta' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'alignment',
          type: 'select',
          defaultValue: 'left',
          required: true,
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
          ],
          admin: { width: '50%' },
        },
        link({ appearances: false }),
      ],
      maxRows: 8,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
