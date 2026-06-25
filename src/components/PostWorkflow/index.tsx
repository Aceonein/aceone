'use client'

import { useAuth, useField, useForm } from '@payloadcms/ui'
import React from 'react'

type Transition = {
  from: string
  to: string
  label: string
  roles: string[]
  variant: 'primary' | 'success' | 'warning' | 'muted'
}

const TRANSITIONS: Transition[] = [
  { from: 'draft',    to: 'review',    label: 'Submit for Review →', roles: ['author', 'moderator', 'admin'], variant: 'primary' },
  { from: 'review',   to: 'draft',     label: '← Back to Draft',     roles: ['moderator', 'admin'],           variant: 'muted' },
  { from: 'review',   to: 'approved',  label: '✓ Approve',           roles: ['moderator', 'admin'],           variant: 'success' },
  { from: 'approved', to: 'review',    label: '← Back to Review',    roles: ['moderator', 'admin'],           variant: 'muted' },
  { from: 'approved', to: 'published', label: '⬆ Publish',           roles: ['admin'],                        variant: 'primary' },
]

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  review: 'In Review',
  approved: 'Approved',
  published: 'Published',
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  draft:     { bg: 'rgba(255,255,255,0.06)', color: '#6b7296' },
  review:    { bg: 'rgba(251,191,36,0.15)',  color: '#fbbf24' },
  approved:  { bg: 'rgba(34,197,94,0.15)',   color: '#22c55e' },
  published: { bg: 'rgba(72,120,232,0.18)',  color: '#6fa0f8' },
}

const VARIANT_STYLES: Record<string, React.CSSProperties> = {
  primary: { background: '#6fa0f8', color: '#0d0f14', fontWeight: 700 },
  success: { background: '#22c55e', color: '#0d0f14', fontWeight: 700 },
  warning: { background: '#fbbf24', color: '#0d0f14', fontWeight: 700 },
  muted:   { background: 'rgba(255,255,255,0.07)', color: '#9099b2', border: '1px solid rgba(255,255,255,0.1)' },
}

const PostWorkflow: React.FC = () => {
  const { user } = useAuth()
  const role = (user as any)?.role ?? 'author'
  const { value: status, setValue } = useField<string>({ path: 'status' })
  const form = useForm()

  const available = TRANSITIONS.filter(
    (t) => t.from === status && t.roles.includes(role),
  )

  const s = STATUS_COLORS[status ?? 'draft'] ?? STATUS_COLORS.draft

  const handleTransition = async (to: string) => {
    setValue(to)
    // Let React flush the setValue, then submit
    setTimeout(() => {
      form.submit()
    }, 0)
  }

  if (!status) return null

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '0 4px',
      }}
    >
      {/* Current status pill */}
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '5px 12px',
          borderRadius: 100,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          background: s.bg,
          color: s.color,
          border: `1px solid ${s.color}30`,
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: s.color,
            display: 'inline-block',
            flexShrink: 0,
          }}
        />
        {STATUS_LABELS[status] ?? status}
      </span>

      {/* Transition buttons */}
      {available.map((t) => (
        <button
          key={t.to}
          type="button"
          onClick={() => handleTransition(t.to)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '5px 14px',
            borderRadius: 6,
            fontSize: 12,
            letterSpacing: '0.02em',
            border: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'opacity 0.15s, transform 0.1s',
            ...VARIANT_STYLES[t.variant],
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)' }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
        >
          {t.label}
        </button>
      ))}

      {status === 'published' && (
        <span
          style={{
            fontSize: 11,
            color: '#4c566a',
            fontStyle: 'italic',
            letterSpacing: '0.02em',
          }}
        >
          Live
        </span>
      )}
    </div>
  )
}

export default PostWorkflow
