import type { Block } from 'payload'

export const Spacer: Block = {
  slug: 'spacer',
  labels: { singular: 'Spacer', plural: 'Spacers' },
  fields: [
    {
      name: 'height',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'Small (16px)', value: 'small' },
        { label: 'Medium (32px)', value: 'medium' },
        { label: 'Large (64px)', value: 'large' },
        { label: 'XLarge (128px)', value: 'xlarge' },
      ],
    },
  ],
}
