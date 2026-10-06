/**
 * Test data for the sandbox only (imported by sandbox.ts after env is set). Logins (all sandbox-only, in-memory DB):
 *   admin@sandbox.test / moderator@sandbox.test / author@sandbox.test  — password below.
 */
import sharp from 'sharp'

export const SANDBOX_PASSWORD = 'sandbox-pass-123'

const para = (text: string) => ({
  type: 'paragraph', version: 1, direction: 'ltr', format: '', indent: 0,
  children: [{ type: 'text', text, version: 1 }],
})
const lexical = (text: string) => ({
  root: { type: 'root', version: 1, direction: 'ltr', format: '', indent: 0, children: [para(text)] },
})

export async function seedSandbox() {
  try {
    await run()
  } catch (e: any) {
    console.error('[sandbox] seed error:', e?.message, JSON.stringify(e?.data?.errors ?? e?.data ?? ''))
    throw e
  }
}

async function run() {
  const { getPayload } = await import('payload')
  const config = (await import('@payload-config')).default
  console.log('[sandbox] initialising Payload...')
  const payload = await getPayload({ config })
  console.log('[sandbox] Payload ready; creating users, authors, categories, posts...')
  const ctx = { skipNsfwCheck: true, disableRevalidate: true }

  const png = async (color: string, w = 1200, h = 675) =>
    sharp({ create: { width: w, height: h, channels: 3, background: color } }).png().toBuffer()

  const mkMedia = async (name: string, color: string, alt: string) => {
    const data = await png(color)
    return payload.create({
      collection: 'media',
      data: { alt },
      file: { data, mimetype: 'image/png', name, size: data.length },
      overrideAccess: true,
      context: ctx,
    })
  }

  const users: Record<string, any> = {}
  for (const [key, role, name] of [['admin', 'admin', 'Sandbox Admin'], ['moderator', 'moderator', 'Sandbox Moderator'], ['author', 'author', 'Sandbox Author']] as const) {
    users[key] = await payload.create({
      collection: 'users',
      data: { email: `${key}@sandbox.test`, password: SANDBOX_PASSWORD, name, role } as any,
      overrideAccess: true,
    })
  }

  const authors: Record<string, any> = {}
  const palette = ['#335c9e', '#9e5a33', '#3a8a5f']
  for (const [i, key] of (['admin', 'moderator', 'author'] as const).entries()) {
    const photo = await mkMedia(`author-${key}.png`, palette[i]!, `${key} portrait`)
    authors[key] = await payload.create({
      collection: 'authors',
      data: {
        name: users[key].name, slug: `sandbox-${key}`, designation: ['Founder & Editor', 'Senior Editor', 'Staff Writer'][i],
        bio: 'Sandbox author used to test the admin design.', profileImage: photo.id, user: users[key].id,
      } as any,
      overrideAccess: true,
      context: ctx,
    })
  }

  const cats: any[] = []
  for (const [i, title] of ['Personal Finance', 'Investing', 'Markets'].entries()) {
    cats.push(await payload.create({ collection: 'categories', data: { title, slug: title.toLowerCase().replace(/\s+/g, '-'), order: i } as any, overrideAccess: true }))
  }

  const statuses = ['published', 'published', 'draft', 'review', 'approved', 'published', 'draft', 'review', 'published', 'approved', 'draft', 'published', 'review', 'published']
  const covers = ['#335c9e', '#9e5a33', '#3a8a5f', '#7a3a8a', '#8a7a3a']
  for (const [i, status] of statuses.entries()) {
    const cover = await mkMedia(`cover-${i + 1}.png`, covers[i % covers.length]!, `Cover ${i + 1}`)
    const owner = ['admin', 'moderator', 'author'][i % 3]!
    await payload.create({
      collection: 'posts',
      data: {
        title: `Sandbox post ${i + 1}: ${['Why index funds win', 'Understanding repo rate', 'Your first credit card', 'EMI vs SIP', 'Inflation and savings'][i % 5]}`,
        slug: `sandbox-post-${i + 1}`, excerpt: 'A short excerpt used to test list views and cards in the admin.',
        author: authors[owner].id, categories: [cats[i % 3].id], featuredImage: cover.id, featuredImageAlt: `Cover ${i + 1}`,
        readTime: 3 + (i % 6), views: i * 37, upvotes: i % 5, status,
        publishedAt: status === 'published' ? new Date(Date.now() - i * 86400000).toISOString() : undefined,
        content: lexical('Sandbox body text for testing the post editor.'),
        createdBy: users[owner].id,
      } as any,
      overrideAccess: true,
      context: ctx,
    })
  }

  const [u, a, po, m] = await Promise.all(['users', 'authors', 'posts', 'media'].map((c) => payload.count({ collection: c as any, overrideAccess: true })))
  console.log(`[sandbox] seeded: users=${u.totalDocs} authors=${a.totalDocs} posts=${po.totalDocs} media=${m.totalDocs}`)
  await (payload.db as any).destroy?.()
}
