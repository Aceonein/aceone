import type { Block } from 'payload'

export const BriefList: Block = {
  slug: 'briefList',
  interfaceName: 'BriefListBlock',
  labels: { singular: 'Brief List', plural: 'Brief Lists' },
  fields: [
    {
      name: 'issuesPerPage',
      type: 'number',
      defaultValue: 9,
      min: 3,
      max: 36,
      admin: { description: 'Issues shown per page' },
    },
  ],
}
