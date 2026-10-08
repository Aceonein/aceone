// Shared by the home page (first page, server-rendered) and /api/blog-posts (load more, category, search)
export const HOME_PAGE_SIZE = 12

export const HOME_POST_SELECT = {
  title: true, slug: true, excerpt: true, publishedAt: true,
  readTime: true, views: true, upvotes: true,
  featuredImage: true, categories: true, author: true,
} as const
