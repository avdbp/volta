import { NextResponse } from 'next/server'

function decodeJwtPayload(token) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = parts[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = atob(base64)
    return JSON.parse(json)
  } catch {
    return null
  }
}

function isTokenValid(token) {
  const payload = decodeJwtPayload(token)
  if (!payload) return false
  const exp = payload.exp
  if (!exp) return false
  return exp * 1000 > Date.now()
}

export function middleware(request) {
  const { pathname } = request.nextUrl

  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('volta_admin_token')?.value
    if (!token || !isTokenValid(token)) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
