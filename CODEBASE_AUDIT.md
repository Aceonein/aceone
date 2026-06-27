# Aceone Codebase Audit

**Last Updated:** 2026-06-27  
**Stack:** Next.js 15 (App Router) + Payload CMS 3.85.1 + MongoDB Atlas + Supabase + Cloudflare R2

---

## Overview

Aceone is a fintech newsletter platform built with Next.js frontend + Payload CMS backend. The codebase is organized around:
- **Public site** (`/src/app/(frontend)`) — readers see this
- **Payload admin** (`/src/app/(payload)`) — editors manage content here
- **API routes** (`/src/app/api`) — cron jobs, newsletter subscribe/unsubscribe, post analytics
- **Payload collections** (`/src/collections`) — database schemas (Posts, Authors, etc.)
- **Components & utilities** — shared React/TS helpers

---

## Directory-by-Directory Breakdown

### `/src/app/(frontend)` — Public Website

**Purpose:** Renders the public-facing site readers see. All routes use `layout.tsx` which loads Header, Footer, theme, providers.

| File | Purpose |
|------|---------|
| `layout.tsx` | Root layout: wraps all pages with Header, Footer, Providers (theme, cookie consent), meta tags. Imports Header/Footer Server components which fetch Payload globals. |
| `page.tsx` | Home page (`/`): BlogHome component. Fetches featured posts from Payload, renders category filter bar, card grid + list toggle. No CMS editing — hardcoded layout. |
| `globals.css` | Design tokens: `--ao-*` color palette (light/dark modes), `--font-*` (Space Grotesk, Space Mono), breakpoints (`--ao-bp-*`), spacing, shadows. 10-color highlight palette `--ao-hl-*`. |
| `not-found.tsx` | 404 page. Generic fallback when route doesn't exist. |
| `(sitemaps)/*/route.ts` | XML sitemap generators for Pages and Posts collections. SEO — helps search engines crawl. |
| `[slug]/page.tsx` | Dynamic route for Payload Pages (e.g., `/privacy`, `/terms`). Fetches by slug, renders with Server-side ISR (24h revalidation). Hero + layout blocks. |
| `posts/[slug]/page.tsx` | Blog article page. Fetches post by slug, renders hero + content blocks + sidebar (upvote, share, tags, related posts). Tallies view count. |
| `the-brief/page.tsx` | Brief listing page. Shows all AceoneBrief issues with year/month filter tabs. |
| `the-brief/[slug]/page.tsx` | Single Brief issue. Fetches by slug, renders with BriefClient (waveform hero, stats, content). |
| `search/page.tsx` | Search UI. Client component with input → calls `/api/search` (Payload search plugin). Shows paginated results. |
| `unsubscribed/page.tsx` | Post-unsubscribe confirmation page. User lands here after clicking unsubscribe link. Success message + link back to home. |

---

### `/src/app/api` — API Routes (Backend Endpoints)

**Purpose:** Serverless functions handling cron jobs, newsletter ops, post analytics, search.

#### Cron Jobs
| File | Purpose |
|------|---------|
| `cron/send-aceone-brief/route.ts` | **Cron:** Runs on Sunday 12:30 PM IST (`0 7 * * 0` UTC). Fetches "scheduled" briefs from Payload, finds all active subscribers, sends via Resend. Updates `lastEmailSentAt`. Protected by `CRON_SECRET`. |

#### Newsletter Management
| File | Purpose |
|------|---------|
| `newsletter/subscribe/route.ts` | **POST:** Newsletter signup. Email regex validation → checks for duplicates in Payload DB → creates subscriber → logs to Supabase → sends welcome email (non-blocking) → rate-limits by IP (3/hour via Upstash). Returns 200/409/400/429/500. |
| `newsletter/unsubscribe/route.ts` | **GET:** Unsubscribe via email link. Token-verified. Sets subscriber `status: unsubscribed` in Payload → marks `revoked_at` in Supabase consent_logs (non-blocking) → redirects to `/unsubscribed`. |
| `newsletter/send-test/route.ts` | **POST:** Admin endpoint. Sends test email to provided address via Resend. Protected by auth. |

#### Post Analytics
| File | Purpose |
|------|---------|
| `posts/[slug]/view/route.ts` | **POST:** Increments post view count. Anonymous tracking (no user required). Updates Payload Post doc's `views` field. |
| `posts/[slug]/upvote/route.ts` | **POST:** Toggle upvote on post. Checks localStorage token to prevent spam. Increments/decrements `upvotes` field. |

---

### `/src/collections` — Payload CMS Collections (Database Schemas)

**Purpose:** Define what data can be stored, edited, accessed. Payload generates admin UI from these configs.

| File | Purpose |
|------|---------|
| `Posts/index.ts` | Blog articles. Fields: title, slug, excerpt, content (13 custom blocks), author (link to Authors), categories (array), tags (array), featuredImage, readTime, views, upvotes, publishedAt, meta (SEO), status (draft/review/approved/published), relatedPosts (self-link). Access: only author/admin can edit own posts. |
| `AceoneBriefs/index.ts` | Newsletter issues. Fields: title, slug, emailSubject, emailPreviewText, content (blocks), author, coverImage, publishedAt, status. Access: admin only for edit. |
| `Authors/index.ts` | Author profiles. Fields: name, slug, bio, designation, profileImage, user (link to Users), social links (Twitter, LinkedIn). Access: authenticated users can create. |
| `Categories.ts` | Blog categories. Fields: title, color (select from 10-color palette). Used to filter posts. Access: anyone can read, authenticated can create. |
| `Tags/index.ts` | Post tags. Fields: name. Simple taxonomy. Access: anyone can read, authenticated can create. |
| `Media/index.ts` | Uploaded files/images. Fields: alt (text), caption (richText). Storage: Cloudflare R2 (via s3Storage plugin, conditional on env vars). Generates 7 image sizes (thumbnail 300px → xlarge 1920px + og 1200x630). Access: authenticated can upload/update, admin can delete. |
| `NewsletterSubscribers/index.ts` | Email subscribers. Fields: email (unique), status (active/unsubscribed/bounced), source (enum: homepage_footer, aceone_brief_page, blog_article, unknown), consentNewsletter (checkbox), consentMarketing (checkbox), subscribedAt, unsubscribedAt, lastEmailSentAt, ipAddress, userAgent, referrer. **Hooks:** `afterDelete` anonymizes Supabase consent_logs. Access: public can create (via API), admin can read/update/delete. |
| `Pages/index.ts` | CMS pages (e.g., /privacy, /terms, future landing pages). Fields: title, slug, hero (type: none/highImpact/mediumImpact/lowImpact/coverStory/textOnly), layout (blocks array), publishedAt, meta (SEO). Access: authenticated can edit, anyone can read published. Live preview wired to `/next/preview` route. |
| `Users/index.ts` | Admin users. Fields: email, password, role (admin/author/moderator/user). Access: admin only. |

---

### `/src/components` — React Components

**Purpose:** Reusable UI building blocks.

#### Layout Components
| File | Purpose |
|------|---------|
| `Header/Component.tsx` (server) | Async component. Fetches `header` global from Payload, extracts navItems, passes to HeaderClient. |
| `Header/Component.client.tsx` | Client component. Renders fixed nav bar. Splits nav items by alignment (left/right). Text items show active highlight (inverted bg + accent border) based on current pathname. CTA items render as buttons. Theme toggle + brand logo. |
| `Footer/Component.tsx` (server) | Async component. Fetches `footer` global, passes to FooterClient. |
| `FooterClient` (not found in list — likely in Component.tsx) | Renders dark grid footer with columns (heading + links), brand tagline, copyright, social links. |

#### Content Components
| File | Purpose |
|------|---------|
| `BlogHome/index.tsx` | Home page layout. Renders hero section + sticky filter bar (categories as pills) + search input + view toggle (card/list) + paginated card/list grid of posts. Client-side filtering + pagination. |
| `BriefClient.tsx` | Single brief viewer. Year/month filter tabs, sidebar issue list (date + title + tags), main content area. Click issue → swap content. Client-side state. |
| `BriefHeroAnimation.tsx` | 6 sine waves (financial oscilloscope aesthetic) using `--ao-hl-*` colors. Horizontal grid lines + pulse node. Rendered as SVG in hero. Prefers-reduced-motion safe. |
| `HeroGeometric.tsx` | Hero geometric pattern animation. Concentric rings, dot grid, diagonal lines, crosshair, scanline sweep. Fades left via CSS mask. Rendered in home hero. |
| `BlockRenderer.tsx` | Renders an array of content blocks (paragraph, heading, code, table, etc.). Looks up block type in global registry, calls matching Component. Slugifies h2 IDs for TOC anchors. |
| `ArticleActions.tsx` | Client component. Left sidebar of article: category badge, upvote button (toggle), share row (Twitter/Copy/Native), tags. Right sidebar: related posts (Payload query, same category), TOC (h2 links), newsletter mini CTA. |
| `NewsletterSection.tsx` | Email signup fold. Title, description, input (with blur validation), submit button. Client-side email regex + error display. On success: setState('done'), localStorage.setItem('ao_subscribed', '1'), show "See you Sunday" success message. Consent text links to `/privacy` + `/terms`. |
| `CookieConsent/index.tsx` | Fixed bottom banner. Checks localStorage `ao_cookie_consent` on mount — if set, hides. Accept/Reject buttons write `{ decision: 'accepted'|'rejected', timestamp }` to localStorage. Links to `/privacy`. No server storage (anonymous). |

#### UI & Utilities
| File | Purpose |
|------|---------|
| `ReadingProgress/index.tsx` | Client component. Renders thin progress bar at top of article. Updates as user scrolls (% of page height). |
| `RichText/index.tsx` | Renders Payload richText field (Lexical JSON) using @payloadcms/richtext-lexical. Converts to React. |
| `Media/index.tsx` | Media wrapper. Detects image vs video, renders ImageMedia or VideoMedia. Handles errors. |
| `Media/ImageMedia/index.tsx` | Next.js Image component. Uses `getMediaUrl()` to construct URL (R2 public URL or Payload fallback). Passes alt, sizes, priority. |
| `Media/VideoMedia/index.tsx` | HTML5 video player. Controls, poster, autoplay logic. |
| `PayloadRedirects/index.tsx` | Redirects plugin UI component (admin only). Shows redirect rules from Payload redirects plugin. |
| `AdminBar/index.tsx` | Top banner (admin view only). Links to Payload admin + seed button. Hidden for non-admin users. |
| `BeforeDashboard/index.tsx` | Payload admin welcome panel. Shows seed button + instructions. |
| `BeforeLogin/index.tsx` | Payload login page message. Custom branding. |
| `ui/*` | shadcn/ui components: button, card, input, select, checkbox, label, pagination, textarea. Tailwind-based, re-exported. |

---

### `/src/Header` & `/src/Footer` — Payload Globals (Server-Rendered)

**Purpose:** Define editable globals + server/client components to render them.

| File | Purpose |
|------|---------|
| `Header/config.ts` | Payload global schema. Fields: navItems (array of { type: text|cta, alignment: left|right, link: { label, url/reference } }). Max 8 items. |
| `Header/Component.tsx` | Server component. Fetches header global via getCachedGlobal (cached 1 hour). Extracts navItems, passes to HeaderClient. |
| `Header/Component.client.tsx` | Renders nav bar. See Components section above. |
| `Header/hooks/revalidateHeader.ts` | Payload afterChange hook. When header global edited, revalidateTag('header') to bust Next.js cache. |
| `Footer/config.ts` | Payload global schema. Fields: brandTagline, copyrightText, columns (array of { heading, links }), socialLinks. |
| `Footer/Component.tsx` | Server component. Fetches footer global, passes to FooterClient. |
| `Footer/hooks/revalidateFooter.ts` | Payload afterChange hook. Revalidates footer cache on edit. |

---

### `/src/blocks` — Content Block Types

**Purpose:** 13 reusable content blocks that editors drag into Posts/Pages/Briefs.

| Block | Purpose |
|-------|---------|
| `Paragraph/` | Simple text block. Lexical editor. |
| `Heading/` | h2/h3/h4. Lexical. ID auto-slugified for TOC. |
| `UnorderedList/ OrderedList/` | Bullet/numbered lists. Lexical. |
| `RichTextBlock/` | Full Lexical editor (all formatting). |
| `Code/` | Code snippet with copy button + syntax highlighting (Prism). Language select. |
| `Table/` | Markdown-style table. Headers + rows. |
| `Accordion/` | Q&A collapse/expand. Lexical content per item. |
| `Banner/` | Colored alert/info box. Lexical content. |
| `CallToAction/` | Large CTA button. Link (internal/external) + appearance (default/outline). |
| `MediaBlock/` | Image/video embed. Reference to Media collection or external URL. |
| `DataBox/` | KPI card grid. Array of { label, value, isNegative? }. Used for "The Real Cost" tables. |
| `PullQuote/` | Large quote + attribution. Italic text styling. |
| `Disclaimer/` | Legal disclaimer. Yellow background. Lexical content. |
| `RelatedPosts/` | Payload query block. Shows posts by category/tag. |
| `ArchiveBlock/` | List of past blog posts. Filters by category. |
| `BlogList/ BriefList/` | Embedded lists of posts/briefs. Paginated. |
| `SectionMarker/` | Visual divider + label (e.g., "Bottom Line"). |
| `Spacer/` | Vertical spacing. Height adjustable. |
| `RenderBlocks.tsx` | Maps block type → component. Called by BlockRenderer. |

---

### `/src/lib` — Libraries & Utilities

#### Email
| File | Purpose |
|------|---------|
| `email/index.ts` | Email provider factory. Returns Resend provider based on env. |
| `email/resend.ts` | Resend API wrapper. `sendEmail()` method calls Resend API with to/subject/html/text/tags. |
| `email/rich-text-to-html.ts` | Converts Payload Lexical JSON → HTML. Used to render email content. |
| `email/tokens.ts` | Unsubscribe token generation/verification. HMAC-based. `generateUnsubscribeToken(email)` → base64 token. `verifyUnsubscribeToken(email, token)` → boolean. |

#### Supabase
| File | Purpose |
|------|---------|
| `supabase.ts` | Lazy-init Supabase client (server-side). Reads `SUPABASE_URL` (or fallback `NEXT_PUBLIC_SUPABASE_URL`) + `SUPABASE_SERVICE_ROLE_KEY`. Returns null if env vars absent (graceful degradation). Singleton pattern. |

---

### `/src/providers` — React Context Providers

| File | Purpose |
|------|---------|
| `index.tsx` | Wraps app with Providers component. Composes: Theme + HeaderTheme + LivePreviewListener. Called in `app/(frontend)/layout.tsx`. |
| `Theme/index.tsx` | Theme context. Reads `data-theme` attr from `<html>`. Provides `theme` + `setTheme()` to descendants. InitTheme client component initializes on first load. |
| `Theme/InitTheme/index.tsx` | Client component. On mount: reads localStorage `aceone-theme` or system preference, sets `document.documentElement.setAttribute('data-theme', t)`. Syncs theme across tabs. |
| `Theme/types.ts` | TypeScript types. Theme = 'light' | 'dark'. |
| `Theme/shared.ts` | Shared theme constants (color values in light/dark). |
| `HeaderTheme/index.tsx` | Separate context for header component. Tracks header background color (e.g., darkens on scroll). Provides `headerTheme` + `setHeaderTheme()`. |

---

### `/src/utilities` — Helper Functions

| File | Purpose |
|------|---------|
| `getURL.ts` | Returns `NEXT_PUBLIC_SERVER_URL` or `http://localhost:3000`. Used for absolute URLs (email links, OG images, etc.). Server-side safe. |
| `getGlobals.ts` | Returns getCachedGlobal function (Payload query). Caches globals in `next/cache` for 1 hour. Fallback to hardcoded if fetch fails. |
| `getMediaUrl.ts` | Constructs media URL. Uses `R2_PUBLIC_URL` if configured, else Payload `/media` path. |
| `getDocument.ts` | Fetches a single Payload document by collection + slug. Used in dynamic routes. |
| `getRedirects.ts` | Fetches redirects from Payload redirects plugin. Used in middleware (next.config.js). |
| `generateMeta.ts` | Generates OG meta tags (title, description, image, URL). |
| `generatePreviewPath.ts` | Generates preview URL for Payload live preview. |
| `mergeOpenGraph.ts` | Merges user meta (title, desc) with default OG tags. |
| `catColor.ts` | Maps category color field → CSS `var(--ao-hl-*)` token. |
| `deepMerge.ts` | Recursive object merge. Used by Payload field configs. |
| `useDebounce.ts` | React hook. Debounces value (500ms default). Used in search input. |
| `ui.ts` | Classnames utility for conditional CSS. |

---

### `/src/fields` — Reusable Payload Field Configs

| File | Purpose |
|------|---------|
| `link.ts` | Reusable link field. Type: internal (reference) or custom URL. Options: newTab, label. Used in nav items, CTAs, etc. |
| `linkGroup.ts` | Array of links. Groups multiple link fields. |
| `defaultLexical.ts` | Default Lexical editor config. Features: bold, italic, code, link, h1-h4, lists, block formatting. Used in text blocks. |

---

### `/src/heros` — Page Hero Renderers

**Purpose:** Different hero layouts. Payload Pages/Posts choose which hero type.

| Type | Purpose |
|------|---------|
| `HighImpact/index.tsx` | Large hero. Image right, text left. Title + description. |
| `MediumImpact/index.tsx` | Mid-size hero. Centered text. |
| `LowImpact/index.tsx` | Small hero. Just title. |
| `TextOnly/index.tsx` | No image. Just text. |
| `CoverStory/index.tsx` | Large background image. Text overlay. Used for brief page. |
| `PostHero/index.tsx` | Blog article hero. Featured image, title, meta (author, date, read time). |
| `RenderHero.tsx` | Maps hero type → component. Called by Pages/Posts renderer. |
| `config.ts` | Payload field config. Hero type selector (dropdown). Shared by Pages + Posts. |

---

### `/src/plugins` — Payload Plugins Configuration

| File | Purpose |
|------|---------|
| `index.ts` | Payload plugins array. Enabled: redirectsPlugin (handles /old-url → /new-url), nestedDocsPlugin (categories hierarchy), seoPlugin (OG meta), formBuilderPlugin (form blocks), searchPlugin (full-text search on posts), s3Storage (R2 upload, conditional). |

---

### `/src/collections` Hooks & Access Control

#### Hooks
| File | Purpose |
|------|---------|
| `Posts/hooks/revalidatePost.ts` | Payload afterChange hook. When post edited, revalidateTag(`post-${slug}`) to bust ISR cache. |
| `Posts/hooks/populateAuthors.ts` | Before create/update. If no author, sets author to current user. |
| `Pages/hooks/revalidatePage.ts` | Payload afterChange hook. Revalidates page cache on edit. |
| `NewsletterSubscribers/afterDelete` (in-file) | Payload afterDelete hook. When subscriber deleted (admin), anonymizes Supabase consent_logs row. |

#### Access Control
| File | Purpose |
|------|---------|
| `access/authenticated.ts` | Returns true if user exists. Used: posts create/update, authors create/update. |
| `access/isAdmin.ts` | Returns true if user.role === 'admin'. Used: users crud, newsletter delete. |
| `access/canEditPost.ts` | Post author can edit own; admin can edit any. |

---

### `/src/endpoints` — Seed Data

| File | Purpose |
|------|---------|
| `seed/index.ts` | Seed function. Wipes existing seed data (posts, authors, tags). Creates: 6 posts (finance education), 6 brief issues, 20 tags, 6 categories with colors, author "Aman Khan", avatar media, 6 post cover images, legal pages (Privacy + Terms). Called via `/admin/seed` endpoint. Idempotent — skips if page slug exists. |

---

### `/src/app/(payload)` — Payload Admin Interface

| File | Purpose |
|------|---------|
| `layout.tsx` | Payload admin layout. Wraps with RootLayout from Payload. |
| `[[...segments]]/page.tsx` | Catch-all route. Renders Payload admin UI. |
| `[[...segments]]/not-found.tsx` | 404 in admin. |
| `importMap.js` | Payload client components registry. Maps component paths for admin UI. |
| `custom.scss` | Custom admin CSS. Overrides Payload default styles. |

---

### `/src/environment.d.ts` — TypeScript Env Types

Declares `process.env.*` types. Ensures TypeScript knows about `SUPABASE_URL`, `RESEND_API_KEY`, etc.

---

### Root-Level Config Files

| File | Purpose |
|------|---------|
| `payload.config.ts` | Payload CMS root config. Collections, globals, plugins, database (MongoDB), admin settings, sharp image processor. s3Storage plugin conditional on R2 env vars. |
| `cssVariables.js` | (Not in file list but referenced) CSS variable definitions. Color palette in OKLCH. |

---

## Data Flow Summary

### Newsletter Signup Flow
1. User fills email in `NewsletterSection.tsx`
2. Client-side regex validation + blur check
3. POST `/api/newsletter/subscribe` with email + consent + metadata
4. Server: validates email regex, checks duplicate in Payload DB, rate-limits IP via Upstash Redis
5. Creates subscriber in `newsletter-subscribers` collection (MongoDB)
6. Non-blocking: logs consent to Supabase `consent_logs` table (service role key)
7. Non-blocking: sends welcome email via Resend
8. Client: localStorage.setItem('ao_subscribed', '1'), shows success message
9. Success state persists across pages (checked in useEffect on mount)

### Blog Post Rendering
1. User navigates to `/posts/slug`
2. Server: fetches Post from Payload by slug
3. Renders hero (PostHero type) + BlockRenderer iterates content array
4. BlockRenderer maps each block type → component
5. Side effects: increments view count (POST `/api/posts/slug/view`)
6. Shows related posts (Payload query, same category)
7. TOC built from h2 IDs (slugified in BlockRenderer)

### Email Cron
1. Vercel triggers cron (`0 7 * * 0` UTC = 12:30 PM IST Sunday)
2. Server: `GET /api/cron/send-aceone-brief` with `CRON_SECRET` in header
3. Finds "scheduled" briefs + all "active" subscribers
4. For each brief: sends HTML email via Resend
5. Updates subscriber `lastEmailSentAt`
6. Updates brief `status: sent`

### Theme Management
1. Client: InitTheme reads localStorage `aceone-theme` or system preference on first load
2. Sets `document.documentElement.setAttribute('data-theme', theme)`
3. CSS variables in `globals.css` use `[data-theme=dark]` selector
4. Header theme toggle button calls setTheme() → updates localStorage + attr
5. Theme synced across tabs via storage event listener

---

## Key Technical Decisions

### Why Lazy-Init Supabase?
Supabase client crashes Payload init if env vars absent. Lazy init (only create client on subscribe route) prevents 500s during build/deployment without vars.

### Why Service Role Key for Consent Logs?
Anon key can't insert due to Row Level Security. Service role bypasses RLS — server-only, safe, and audit logs should be stored regardless of user consent.

### Why localStorage for Cookie Consent?
Anonymous visitors have no PK. No server storage possible. localStorage-only is DPDP-compliant for Phase 1 (consent recorded, no tracking).

### Why Conditional s3Storage Plugin?
Env vars might be missing during dev/staging. Conditional enable prevents Payload init crash.

### Why Text-Only Legal Pages?
Privacy + Terms shouldn't be CMS-editable (version control needed). But they're in Payload Pages for admin convenience + future editability. Created by seed, not static routes.

---

## Security Considerations

1. **API Secrets:** `CRON_SECRET` required for cron routes (Bearer token)
2. **Email Token:** Unsubscribe links use HMAC-signed tokens (1 hour expiry)
3. **Rate Limiting:** Subscribe endpoint limited 3/hour per IP (Upstash Redis)
4. **Supabase Service Role:** Stored in Vercel secrets, never exposed to client
5. **Media Storage:** R2 handles CORS/auth. Cloudflare CDN caches publicly
6. **Payload Access Control:** Collections define read/create/update/delete per role

---

## Missing/Future Work

1. **OG Images:** Per-post `og:image` not wired (dynamic image generation)
2. **Advanced Search:** Full-text search plugin installed but not customized
3. **Analytics:** View/upvote tracking exists but no dashboard
4. **Email Templates:** Welcome email hardcoded HTML (could be Payload template)
5. **Mobile Responsiveness:** Frontend designed for desktop; mobile breakpoints exist but untested in browser

---

## File Count Summary

- **Components:** 20+ (Header, Footer, BlogHome, BriefClient, etc.)
- **Blocks:** 14 content block types
- **Collections:** 8 (Posts, Authors, Pages, Media, etc.)
- **API Routes:** 7 (cron, subscribe, unsubscribe, views, upvotes, send-test, search)
- **Utilities:** 12+ helper functions
- **Providers:** 3 (Theme, HeaderTheme, LivePreviewListener)
- **Total Source Files:** ~120+ TypeScript/TSX files
