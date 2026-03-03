'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const DEFAULT_HERO = {
  headline: 'Coffee Roasted With Purpose',
  subtitle: 'Single origin. Small batch. Barcelona.',
  ctaText: 'Explore Our Roasts',
}

export default function HeroEditor() {
  const router = useRouter()
  const [headline, setHeadline] = useState(DEFAULT_HERO.headline)
  const [subtitle, setSubtitle] = useState(DEFAULT_HERO.subtitle)
  const [ctaText, setCtaText] = useState(DEFAULT_HERO.ctaText)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('volta_admin_token') : null
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  useEffect(() => {
    fetch('/api/hero', { headers: getAuthHeaders() })
      .then((res) => {
        if (res.status === 401) {
          router.push('/admin/login')
          throw new Error('Unauthorized')
        }
        if (!res.ok) throw new Error('Failed to load')
        return res.json()
      })
      .then((data) => {
        setHeadline(data.headline || DEFAULT_HERO.headline)
        setSubtitle(data.subtitle || DEFAULT_HERO.subtitle)
        setCtaText(data.ctaText || DEFAULT_HERO.ctaText)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [router])

  const showToast = (message, type) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/hero', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ headline, subtitle, ctaText }),
      })
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      if (!res.ok) {
        let errMsg = 'Save failed'
        try {
          const err = await res.json()
          errMsg = err.error || err.message || errMsg
        } catch {
          errMsg = 'Save failed'
        }
        throw new Error(errMsg)
      }
      await res.json()
      showToast('Saved successfully!', 'success')
    } catch (err) {
      showToast(err.message || 'Failed to save', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-[#F5ECD7] mb-6">Edit Hero Content</h2>
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-[#F5ECD7] text-sm font-medium mb-2">Headline</label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value.slice(0, 60))}
            maxLength={60}
            className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded text-[#F5ECD7] focus:border-[#C9A84C] focus:outline-none transition-colors"
          />
          <p className="text-[#F5ECD7]/60 text-xs mt-1">{headline.length}/60</p>
        </div>
        <div>
          <label className="block text-[#F5ECD7] text-sm font-medium mb-2">Subtitle</label>
          <textarea
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value.slice(0, 120))}
            maxLength={120}
            rows={3}
            className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded text-[#F5ECD7] focus:border-[#C9A84C] focus:outline-none transition-colors resize-none"
          />
          <p className="text-[#F5ECD7]/60 text-xs mt-1">{subtitle.length}/120</p>
        </div>
        <div>
          <label className="block text-[#F5ECD7] text-sm font-medium mb-2">CTA Button Text</label>
          <input
            type="text"
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value.slice(0, 30))}
            maxLength={30}
            className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded text-[#F5ECD7] focus:border-[#C9A84C] focus:outline-none transition-colors"
          />
          <p className="text-[#F5ECD7]/60 text-xs mt-1">{ctaText.length}/30</p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-4 bg-[#C9A84C] text-[#0D0D0D] font-semibold rounded hover:bg-[#D4B85C] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg transition-opacity duration-300 ${
            toast.type === 'success' ? 'bg-[#10B981]' : 'bg-[#EF4444]'
          } text-white font-medium`}
        >
          {toast.message}
        </div>
      )}
    </div>
  )
}
