'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('volta_admin_token')
    if (token) {
      router.push('/admin')
    }
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()

      if (data.success && data.token) {
        localStorage.setItem('volta_admin_token', data.token)
        document.cookie = `volta_admin_token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`
        router.push('/admin')
      } else {
        setError('Invalid username or password')
        setPassword('')
      }
    } catch {
      setError('Invalid username or password')
      setPassword('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-[#C9A84C] font-bold text-2xl mb-8 text-center">
          VOLTA COFFEE
        </h1>
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#F5ECD7] text-sm font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded text-[#F5ECD7] focus:border-[#C9A84C] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-[#F5ECD7] text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded text-[#F5ECD7] focus:border-[#C9A84C] focus:outline-none"
                required
              />
            </div>
            {error && (
              <p className="text-[#EF4444] text-sm">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-[#C9A84C] text-[#0D0D0D] font-semibold rounded hover:bg-[#D4B85C] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
