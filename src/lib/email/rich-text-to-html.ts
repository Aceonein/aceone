/**
 * Converts Payload Lexical JSON to email-safe inline-styled HTML.
 */
export async function convertRichTextToEmailHTML(content: any, coverImageUrl: string): Promise<string> {
  const bodyHTML = lexicalToHTML(content)

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="background-color:#0d0f14;color:#edeae3;font-family:'DM Sans',Arial,sans-serif;margin:0;padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" style="padding:20px 0;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
          <tr>
            <td align="center" style="padding:20px;">
              <span style="font-size:22px;font-weight:bold;color:#edeae3;letter-spacing:0.05em;">ACEONE</span>
            </td>
          </tr>
          ${coverImageUrl ? `
          <tr>
            <td>
              <img src="${coverImageUrl}" alt="Cover" width="600" style="width:100%;height:auto;display:block;" />
            </td>
          </tr>` : ''}
          <tr>
            <td style="padding:40px 30px;font-size:16px;line-height:1.6;color:#d8dee9;">
              ${bodyHTML}
            </td>
          </tr>
          <tr>
            <td style="padding:40px 30px;text-align:center;border-top:1px solid #2e3440;">
              <p style="font-size:13px;color:#7a8196;margin:8px 0;">
                You're receiving this because you subscribed to The Aceone Brief.
              </p>
              <p style="font-size:13px;color:#7a8196;margin:8px 0;">
                <a href="https://aceone.in" style="color:#00c896;text-decoration:none;">Visit Website</a>
              </p>
              <p style="font-size:13px;color:#7a8196;margin:8px 0;">
                <a href="{{unsubscribe_url}}" style="color:#7a8196;text-decoration:underline;">Unsubscribe</a>
              </p>
              <p style="font-size:12px;color:#4c566a;margin-top:20px;">© 2026 Aceone. Mumbai, India.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim()
}

function lexicalToHTML(content: any): string {
  if (!content?.root?.children) return ''
  return content.root.children.map(nodeToHTML).join('')
}

function nodeToHTML(node: any): string {
  switch (node.type) {
    case 'paragraph': {
      const inner = (node.children || []).map(nodeToHTML).join('')
      return `<p style="margin:0 0 16px;line-height:1.6;">${inner}</p>`
    }
    case 'heading': {
      const tag = node.tag || 'h2'
      const sizes: Record<string, string> = {
        h1: '32px', h2: '24px', h3: '20px', h4: '18px',
      }
      const fs = sizes[tag] || '20px'
      const inner = (node.children || []).map(nodeToHTML).join('')
      return `<${tag} style="font-size:${fs};font-weight:bold;color:#edeae3;margin:24px 0 12px;line-height:1.3;">${inner}</${tag}>`
    }
    case 'list': {
      const tag = node.listType === 'number' ? 'ol' : 'ul'
      const items = (node.children || []).map(nodeToHTML).join('')
      return `<${tag} style="margin:16px 0;padding-left:20px;line-height:1.6;">${items}</${tag}>`
    }
    case 'listitem': {
      const inner = (node.children || []).map(nodeToHTML).join('')
      return `<li style="margin-bottom:8px;">${inner}</li>`
    }
    case 'link': {
      const inner = (node.children || []).map(nodeToHTML).join('')
      return `<a href="${node.url || '#'}" style="color:#00c896;text-decoration:underline;">${inner}</a>`
    }
    case 'quote': {
      const inner = (node.children || []).map(nodeToHTML).join('')
      return `<blockquote style="border-left:3px solid #00c896;margin:16px 0;padding:8px 16px;color:#b0b8c8;">${inner}</blockquote>`
    }
    case 'horizontalrule':
      return `<hr style="border:none;border-top:1px solid #2e3440;margin:24px 0;" />`
    case 'text': {
      let text = node.text || ''
      const fmt = node.format || 0
      if (fmt & 1) text = `<strong>${text}</strong>`
      if (fmt & 2) text = `<em>${text}</em>`
      if (fmt & 8) text = `<code style="background:#1a1d24;padding:2px 6px;border-radius:3px;font-family:monospace;">${text}</code>`
      if (fmt & 16) text = `<s>${text}</s>`
      return text
    }
    default:
      return ''
  }
}

export function stripHTML(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n\s*\n/g, '\n\n')
    .trim()
}
