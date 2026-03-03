'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import HeroEditor from './components/HeroEditor'
import ImagesEditor from './components/ImagesEditor'
import OffersEditor from './components/OffersEditor'

function getTimeUntilReset() {
  const now = new Date()
  const nextHour = new Date(now)
  nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0)
  const diff = nextHour - now
  const minutes = Math.floor(diff / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

const TABS = [
  { id: 'hero', label: 'Hero Content', icon: '🏠', Component: HeroEditor },
  { id: 'images', label: 'Images', icon: '🖼️', Component: ImagesEditor },
  { id: 'offers', label: 'Offers', icon: '🏷️', Component: OffersEditor },
]

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('hero')
  const [countdown, setCountdown] = useState(getTimeUntilReset())
  const [resetStatus, setResetStatus] = useState('idle')

  useEffect(() => {
    const token = localStorage.getItem('volta_admin_token')
    if (!token) {
      router.push('/admin/login')
    }
  }, [router])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const nextHour = new Date(now)
      nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0)
      const diff = nextHour - now
      if (diff <= 0) {
        window.location.reload()
        return
      }
      const minutes = Math.floor(diff / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      setCountdown(
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      )
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('volta_admin_token')
    document.cookie = 'volta_admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    router.push('/admin/login')
  }

  async function handleManualReset() {
    setResetStatus('loading')
    try {
      const res = await fetch('/api/reset', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET}`,
        },
      })
      if (!res.ok) throw new Error('Reset failed')
      setResetStatus('success')
      setTimeout(() => window.location.reload(), 2000)
    } catch {
      setResetStatus('error')
      setTimeout(() => setResetStatus('idle'), 2000)
    }
  }

  const buttonLabel = {
    idle: 'Reset Now',
    loading: 'Resetting...',
    success: '✅ Reset!',
    error: '❌ Failed',
  }[resetStatus]

  const buttonStyle = {
    success: { color: '#10B981' },
    error: { color: '#EF4444' },
  }[resetStatus] || {}

  const ActiveComponent = TABS.find((t) => t.id === activeTab)?.Component

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col">
      {/* Demo Banner */}
      <div
        style={{
          backgroundColor: '#F59E0B',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          color: '#1A1A1A',
        }}
      >
        {/* Left */}
        <div>
          <span style={{ fontWeight: 'bold' }}>🔄 Demo Mode</span>
          <span> — All changes reset automatically every hour</span>
          <span style={{ marginLeft: '12px', opacity: 0.8, fontSize: '13px' }}>
            Login: admin / volta2024
          </span>
        </div>

        {/* Center */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 'bold',
          }}
        >
          <span>Next reset in:</span>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '18px',
              backgroundColor: '#1A1A1A',
              color: '#F5ECD7',
              padding: '2px 8px',
              borderRadius: '4px',
            }}
          >
            {countdown}
          </span>
        </div>

        {/* Right */}
        <button
          type="button"
          onClick={handleManualReset}
          disabled={resetStatus !== 'idle'}
          style={{
            backgroundColor: '#1A1A1A',
            color: 'white',
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: resetStatus !== 'idle' ? 'not-allowed' : 'pointer',
            border: '1px solid #333',
            opacity: resetStatus !== 'idle' ? 0.7 : 1,
            ...buttonStyle,
          }}
          onMouseOver={(e) => {
            if (resetStatus === 'idle') {
              e.currentTarget.style.backgroundColor = '#2A2A2A'
            }
          }}
          onMouseOut={(e) => {
            if (resetStatus === 'idle') {
              e.currentTarget.style.backgroundColor = '#1A1A1A'
            }
          }}
        >
          {buttonLabel}
        </button>
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-[#2A2A2A]">
        <h1 className="text-[#C9A84C] font-bold text-lg md:text-xl">VOLTA COFFEE — Admin</h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/')}
            style={{
              backgroundColor: 'transparent',
              color: '#C9A84C',
              border: '1px solid #C9A84C',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'background-color 0.2s, color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#C9A84C'
              e.currentTarget.style.color = '#0D0D0D'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#C9A84C'
            }}
          >
            Visit Website ↗
          </button>
          <button
          type="button"
          onClick={handleLogout}
          className="px-4 py-2 text-[#F5ECD7] border border-[#2A2A2A] rounded hover:border-[#C9A84C] transition-colors duration-200"
        >
          Logout
        </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar - desktop */}
        <aside className="hidden md:flex flex-col w-56 border-r border-[#2A2A2A] bg-[#1A1A1A]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-left transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'bg-[#C9A84C]/20 text-[#C9A84C] border-l-2 border-[#C9A84C]'
                  : 'text-[#F5ECD7] hover:bg-[#2A2A2A]'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </aside>

        {/* Mobile tabs */}
        <div className="md:hidden flex border-b border-[#2A2A2A] overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'text-[#C9A84C] border-b-2 border-[#C9A84C]'
                  : 'text-[#F5ECD7] hover:bg-[#2A2A2A]'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {ActiveComponent && <ActiveComponent />}
        </main>
      </div>
    </div>
  )
}
