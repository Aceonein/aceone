# Aceone — Claude Project Instructions

## What This Is
Fintech platform. Next.js (App Router) + Payload CMS. Vibe-coded with Claude.

## Who's Coding
Aman — not a developer, but understands architecture and can read code.
Explain decisions, not syntax. Keep diffs minimal. Flag when something is risky.

## Stack
- Next.js App Router
- Payload CMS (collections, globals, auth)
- MongoDB Atlas, Cloudflare R2 (media), Vercel (blog.aceone.in), Resend, Upstash Redis, OpenAI moderation, Cloudflare Workers AI
- Payload 3.85; admin styled in `src/app/(payload)/admin.scss`

## Conventions
- Admin custom components in `src/components/Admin/*` and `src/components/ImagePicker`; register via collection `admin.components`, then run `npx payload generate:importmap`
- Test admin changes with `npm run dev:sandbox` (disposable DB, port 3100); stop it before committing
- Public queries via local API must filter `status: published` (local API bypasses access by default)
- Full structure + gotchas: `~/.claude/memory/aceone.md`

## Before Every Session
1. Read `~/.claude/memory/aceone.md` for current state
2. Read `~/.claude/memory/in-progress.md` for active tasks
3. Ask if anything has changed before writing code

## Rules
- Ponytail: smallest working change. No speculative features.
- Always explain what a change does and why before making it
- Flag breaking changes explicitly
- When done: suggest updating `~/.claude/memory/aceone.md` with what changed

## Current Focus
Admin revamp + unified image picker shipped (main @ e554471). Next: verify picker on prod, Redis token check, optional per-post image framing. See in-progress.md.
