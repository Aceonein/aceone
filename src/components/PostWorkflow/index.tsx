'use client'

import { useAuth, useField, useForm } from '@payloadcms/ui'
import React from 'react'

type Transition = {
  from: string
  to: string
  label: string
  roles: string[]
  variant: 'primary' | 'success' | 'muted'
}

const TRANSITIONS: Transition[] = [
  { from: 'draft', to: 'review', label: 'Submit for review', roles: ['author', 'moderator', 'admin'], variant: 'primary' },
  { from: 'review', to: 'draft', label: 'Back to draft', roles: ['moderator', 'admin'], variant: 'muted' },
  { from: 'review', to: 'approved', label: 'Approve', roles: ['moderator', 'admin'], variant: 'success' },
  { from: 'approved', to: 'review', label: 'Back to review', roles: ['moderator', 'admin'], variant: 'muted' },
  { from: 'approved', to: 'published', label: 'Publish', roles: ['admin'], variant: 'primary' },
]

const STATUS: Record<string, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'var(--theme-elevation-500)' },
  review: { label: 'In review', color: 'var(--ao-amber)' },
  approved: { label: 'Approved', color: 'var(--ao-violet)' },
  published: { label: 'Published', color: 'var(--ao-green)' },
}

const PostWorkflow: React.FC = () => {
  const { user } = useAuth()
  const role = (user as any)?.role ?? 'author'
  const { value: status, setValue } = useField<string>({ path: 'status' })
  const form = useForm()

  const available = TRANSITIONS.filter((t) => t.from === status && t.roles.includes(role))
  const s = STATUS[status ?? 'draft'] ?? STATUS.draft!

  const handleTransition = (to: string) => {
    setValue(to)
    // Let React flush the value, then submit
    setTimeout(() => {
      form.submit()
    }, 0)
  }

  if (!status) return null

  return (
    <div className="ao-wf">
      <span className="ao-badge" style={{ ['--b' as any]: s.color }}>
        {s.label}
      </span>

      {available.map((t) => (
        <button key={t.to} type="button" className={`ao-wf__btn ao-wf__btn--${t.variant}`} onClick={() => handleTransition(t.to)}>
          {t.label}
        </button>
      ))}

      {status === 'published' && <span className="ao-muted">Live on the site</span>}
    </div>
  )
}

export default PostWorkflow
