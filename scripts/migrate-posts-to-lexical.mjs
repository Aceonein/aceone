/**
 * Migrate Posts content from blocks[] → Lexical SerializedEditorState
 * Run: node scripts/migrate-posts-to-lexical.mjs
 *
 * Converts:
 *   paragraph   → Lexical paragraph nodes (already Lexical inside; extract children)
 *   heading     → Lexical heading node
 *   ordered-list / unordered-list → Lexical list node
 *   data-box, pull-quote, table, section-marker, spacer, disclaimer, accordion, image
 *               → Lexical block node { type:'block', fields:{ blockType, ...} }
 */

const BASE = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const EMAIL = process.env.PAYLOAD_EMAIL || 'kaman6797@gmail.com'
const PASSWORD = process.env.PAYLOAD_PASSWORD

if (!PASSWORD) {
  console.error('Set PAYLOAD_PASSWORD env var before running.')
  process.exit(1)
}

// ── Auth ──────────────────────────────────────────────────────────────────────
async function login() {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  const data = await res.json()
  if (!data.token) { console.error('Login failed', data); process.exit(1) }
  return data.token
}

// ── Conversion helpers ────────────────────────────────────────────────────────
function textNode(text) {
  return { type: 'text', text: text ?? '', version: 1, format: 0, mode: 'normal', style: '', detail: 0 }
}

function lexicalRoot(children) {
  return { root: { type: 'root', children, direction: 'ltr', format: '', indent: 0, version: 1 } }
}

function convertBlock(block) {
  const { id, blockType, blockName, ...fields } = block

  // paragraph: already has Lexical JSON in .content — extract children
  if (blockType === 'paragraph') {
    return block.content?.root?.children ?? []
  }

  // heading: plain text → Lexical heading node
  if (blockType === 'heading') {
    return [{
      type: 'heading',
      tag: block.level || 'h2',
      children: [textNode(block.text)],
      version: 1,
      direction: 'ltr',
      format: '',
      indent: 0,
      textFormat: 0,
      textStyle: '',
    }]
  }

  // unordered-list
  if (blockType === 'unordered-list') {
    return [{
      type: 'list',
      listType: 'bullet',
      start: 1,
      tag: 'ul',
      version: 1,
      direction: 'ltr',
      format: '',
      indent: 0,
      children: (block.items ?? []).map((item, idx) => ({
        type: 'listitem',
        value: idx + 1,
        version: 1,
        direction: 'ltr',
        format: '',
        indent: 0,
        // item.text is Lexical JSON; grab inner paragraph's children
        children: item.text?.root?.children?.[0]?.children ?? [textNode('')],
      })),
    }]
  }

  // ordered-list
  if (blockType === 'ordered-list') {
    const start = block.startNumber ?? 1
    return [{
      type: 'list',
      listType: 'number',
      start,
      tag: 'ol',
      version: 1,
      direction: 'ltr',
      format: '',
      indent: 0,
      children: (block.items ?? []).map((item, idx) => ({
        type: 'listitem',
        value: start + idx,
        version: 1,
        direction: 'ltr',
        format: '',
        indent: 0,
        children: item.text?.root?.children?.[0]?.children ?? [textNode('')],
      })),
    }]
  }

  // everything else → Lexical block node
  return [{
    type: 'block',
    version: 2,
    fields: {
      id: id ?? '',
      blockType,
      blockName: blockName ?? '',
      ...fields,
    },
  }]
}

function convertPostContent(blocks) {
  const children = blocks.flatMap(convertBlock)
  // Ensure root always has at least one paragraph
  if (!children.length) {
    children.push({ type: 'paragraph', children: [textNode('')], version: 1, direction: 'ltr', format: '', indent: 0 })
  }
  return lexicalRoot(children)
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('Logging in…')
  const token = await login()
  const headers = { 'Content-Type': 'application/json', Authorization: `JWT ${token}` }

  console.log('Fetching posts…')
  const listRes = await fetch(`${BASE}/api/posts?limit=200&depth=0`, { headers })
  const { docs } = await listRes.json()
  console.log(`Found ${docs.length} posts`)

  for (const post of docs) {
    const content = post.content
    // Skip if already migrated (content is an object with .root, not an array)
    if (!Array.isArray(content)) {
      console.log(`  [skip] ${post.id} — already Lexical JSON`)
      continue
    }

    console.log(`  Migrating "${post.title}" (${content.length} blocks)…`)
    const newContent = convertPostContent(content)

    const updateRes = await fetch(`${BASE}/api/posts/${post.id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ content: newContent }),
    })
    const result = await updateRes.json()
    if (result.errors?.length) {
      console.error(`    ERROR:`, JSON.stringify(result.errors, null, 2))
    } else {
      console.log(`    OK`)
    }
  }

  console.log('Done.')
}

main().catch(err => { console.error(err); process.exit(1) })
