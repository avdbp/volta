import { NextResponse } from 'next/server'
import { signToken } from '../../../lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const body = await request.json()
    const { username, password } = body || {}

    const adminUser = process.env.ADMIN_USER
    const adminPassword = process.env.ADMIN_PASSWORD

    if (username === adminUser && password === adminPassword) {
      const token = signToken({ username })
      return NextResponse.json({ success: true, token })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
