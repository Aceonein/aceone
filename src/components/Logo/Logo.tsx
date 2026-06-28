import React from 'react'

export const Logo = () => {
  return (
    <span style={{
      fontFamily: "'Space Mono', monospace",
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--theme-text, #d8dae6)',
      userSelect: 'none',
    }}>
      ACEONE/
    </span>
  )
}
