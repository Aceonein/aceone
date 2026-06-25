import type { Block } from 'payload'

export const BlogList: Block = {
  slug: 'blogList',
  interfaceName: 'BlogListBlock',
  labels: { singular: 'Blog List', plural: 'Blog Lists' },
  fields: [
    {
      name: 'postsPerPage',
      type: 'number',
      defaultValue: 12,
      min: 3,
      max: 48,
      admin: { description: 'Posts shown per page' },
    },
    {
      name: 'showCategoryFilter',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show category filter bar',
    },
  ],
}
