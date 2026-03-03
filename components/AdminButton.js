'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdminButton() {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('volta_admin_token')
    setIsLoggedIn(!!token)
  }, [])

  if (pathname.startsWith('/admin')) return null

  return (
    <a
      href={isLoggedIn ? '/admin' : '/admin/login'}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#1A1A1A',
        color: '#C9A84C',
        border: '1px solid #C9A84C',
        padding: '8px 16px',
        borderRadius: '6px',
        fontSize: '13px',
        cursor: 'pointer',
        zIndex: 9999,
        textDecoration: 'none',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#C9A84C'
        e.currentTarget.style.color = '#1A1A1A'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#1A1A1A'
        e.currentTarget.style.color = '#C9A84C'
      }}
    >
      {isLoggedIn ? '⚙ Dashboard' : '⚙ Admin'}
    </a>
  )
}
