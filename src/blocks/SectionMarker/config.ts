import type { Block } from 'payload'

export const SectionMarker: Block = {
  slug: 'section-marker',
  labels: { singular: 'Section Marker', plural: 'Section Markers' },
  fields: [
    {
      name: 'label',
      type: 'text',
      admin: { description: 'Optional label shown in TOC' },
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'line',
      options: [
        { label: 'Line', value: 'line' },
        { label: 'Dots', value: 'dots' },
        { label: 'Spacer', value: 'spacer' },
      ],
    },
  ],
}
