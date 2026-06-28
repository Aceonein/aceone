import React from 'react'

const BeforeLogin: React.FC = () => {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: 'var(--theme-text-dim, #6b7296)',
        marginBottom: 8,
      }}>
        Aceone Blog
      </div>
      <p style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 11,
        color: 'var(--theme-text-dim, #6b7296)',
        lineHeight: 1.6,
        margin: 0,
      }}>
        Admin access only. Contact the site owner if you need an account.
      </p>
    </div>
  )
}

export default BeforeLogin
