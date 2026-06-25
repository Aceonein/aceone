import type { Block } from 'payload'

export const DataBox: Block = {
  slug: 'data-box',
  labels: { singular: 'Data Box', plural: 'Data Boxes' },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'dataPoints',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: { description: 'e.g. Revenue Growth' },
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: { description: 'e.g. +24.5%' },
        },
        {
          name: 'unit',
          type: 'text',
          admin: { description: 'e.g. YoY (optional)' },
        },
        {
          name: 'isNegative',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Highlight as negative value' },
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'horizontal',
      options: [
        { label: 'Horizontal', value: 'horizontal' },
        { label: 'Vertical', value: 'vertical' },
        { label: 'Grid', value: 'grid' },
      ],
    },
  ],
}
