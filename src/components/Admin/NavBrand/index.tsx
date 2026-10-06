import Link from 'next/link'
import React from 'react'

import MobileBar from '../MobileBar'
import NavCollapse from '../NavCollapse'

export default function NavBrand() {
  return (
    <div className="ao-brand">
      <Link href="/admin" className="ao-brand__mark" aria-label="Aceone dashboard">
        <span className="ao-brand__dot" />
        <span className="ao-brand__name">Aceone</span>
      </Link>
      <NavCollapse />
      <Link href="/admin/collections/posts/create" className="ao-brand__new" data-tip="New post">
        <span aria-hidden="true">+</span>
        <span className="ao-brand__new-label"> New post</span>
      </Link>
      <MobileBar />
    </div>
  )
}
