'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const DEFAULT_HERO_IMAGE =
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&q=80'
const DEFAULT_ABOUT_IMAGE =
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80'

export default function ImagesEditor() {
  const router = useRouter()
  const [heroImage, setHeroImage] = useState(DEFAULT_HERO_IMAGE)
  const [aboutImage, setAboutImage] = useState(DEFAULT_ABOUT_IMAGE)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(null)
  const [toast, setToast] = useState(null)

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('volta_admin_token') : null
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  useEffect(() => {
    const headers = getAuthHeaders()
    Promise.all([
      fetch('/api/hero', { headers }).then((r) => {
        if (r.status === 401) {
          router.push('/admin/login')
          throw new Error('Unauthorized')
        }
        if (!r.ok) throw new Error('Failed to load')
        return r.json()
      }),
      fetch('/api/settings', { headers }).then((r) => {
        if (r.status === 401) {
          router.push('/admin/login')
          throw new Error('Unauthorized')
        }
        if (!r.ok) throw new Error('Failed to load')
        return r.json()
      }),
    ])
      .then(([hero, settings]) => {
        setHeroImage(hero.backgroundImage || hero.heroImage || DEFAULT_HERO_IMAGE)
        setAboutImage(settings.aboutImage || DEFAULT_ABOUT_IMAGE)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [router])

  const showToast = (message, type) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSaveHero = async () => {
    setSaving('hero')
    try {
      const res = await fetch('/api/hero', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ backgroundImage: heroImage }),
      })
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      const text = await res.text()
      if (!res.ok) {
        let errMsg = 'Failed to save'
        try {
          const err = JSON.parse(text)
          errMsg = err.error || err.message || errMsg
        } catch {
          errMsg = `Error ${res.status}: Failed to save`
        }
        throw new Error(errMsg)
      }
      JSON.parse(text)
      showToast('Saved successfully!', 'success')
    } catch (err) {
      showToast(err.message || 'Failed to save', 'error')
    } finally {
      setSaving(null)
    }
  }

  const handleSaveAbout = async () => {
    setSaving('about')
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ aboutImage }),
      })
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      const text = await res.text()
      if (!res.ok) {
        let errMsg = 'Failed to save'
        try {
          const err = JSON.parse(text)
          errMsg = err.error || err.message || errMsg
        } catch {
          errMsg = `Error ${res.status}: Failed to save`
        }
        throw new Error(errMsg)
      }
      JSON.parse(text)
      showToast('Saved successfully!', 'success')
    } catch (err) {
      showToast(err.message || 'Failed to save', 'error')
    } finally {
      setSaving(null)
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
    <div>
      <h2 className="text-xl font-bold text-[#F5ECD7] mb-6">Edit Images</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hero Background Image */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6">
          <label className="block text-[#F5ECD7] font-medium mb-2">Hero Background Image</label>
          <div className="mb-4 rounded overflow-hidden h-[150px] bg-[#111111]">
            <img
              src={heroImage}
              alt="Hero preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23111" width="100" height="100"/><text x="50" y="50" fill="%23666" text-anchor="middle" dy=".3em">Invalid URL</text></svg>'
              }}
            />
          </div>
          <input
            type="text"
            value={heroImage}
            onChange={(e) => setHeroImage(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded text-[#F5ECD7] focus:border-[#C9A84C] focus:outline-none transition-colors mb-2"
          />
          <p style={{ fontSize: '12px', color: '#888', marginTop: '6px', marginBottom: '16px' }}>
            Try different images by copying and pasting their URLs from free stock photo sites:{' '}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#C9A84C',
                textDecoration: 'underline',
                margin: '0 4px',
              }}
              onMouseEnter={(e) => { e.target.style.color = 'white' }}
              onMouseLeave={(e) => { e.target.style.color = '#C9A84C' }}
            >
              Unsplash
            </a>
            ,
            <a
              href="https://pexels.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#C9A84C',
                textDecoration: 'underline',
                margin: '0 4px',
              }}
              onMouseEnter={(e) => { e.target.style.color = 'white' }}
              onMouseLeave={(e) => { e.target.style.color = '#C9A84C' }}
            >
              Pexels
            </a>
            {' or '}
            <a
              href="https://picsum.photos"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#C9A84C',
                textDecoration: 'underline',
                margin: '0 4px',
              }}
              onMouseEnter={(e) => { e.target.style.color = 'white' }}
              onMouseLeave={(e) => { e.target.style.color = '#C9A84C' }}
            >
              Picsum
            </a>
            . Right click any image → &quot;Copy image address&quot; → paste it here.
          </p>
          <button
            type="button"
            onClick={handleSaveHero}
            disabled={saving === 'hero'}
            className="px-4 py-2 bg-[#C9A84C] text-[#0D0D0D] font-semibold rounded hover:bg-[#D4B85C] transition-colors duration-200 disabled:opacity-50"
          >
            {saving === 'hero' ? 'Saving...' : 'Save'}
          </button>
        </div>

        {/* About Section Image */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6">
          <label className="block text-[#F5ECD7] font-medium mb-2">About Section Image</label>
          <div className="mb-4 rounded overflow-hidden h-[150px] bg-[#111111]">
            <img
              src={aboutImage}
              alt="About preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23111" width="100" height="100"/><text x="50" y="50" fill="%23666" text-anchor="middle" dy=".3em">Invalid URL</text></svg>'
              }}
            />
          </div>
          <input
            type="text"
            value={aboutImage}
            onChange={(e) => setAboutImage(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded text-[#F5ECD7] focus:border-[#C9A84C] focus:outline-none transition-colors mb-2"
          />
          <p style={{ fontSize: '12px', color: '#888', marginTop: '6px', marginBottom: '16px' }}>
            Try different images by copying and pasting their URLs from free stock photo sites:{' '}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#C9A84C',
                textDecoration: 'underline',
                margin: '0 4px',
              }}
              onMouseEnter={(e) => { e.target.style.color = 'white' }}
              onMouseLeave={(e) => { e.target.style.color = '#C9A84C' }}
            >
              Unsplash
            </a>
            ,
            <a
              href="https://pexels.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#C9A84C',
                textDecoration: 'underline',
                margin: '0 4px',
              }}
              onMouseEnter={(e) => { e.target.style.color = 'white' }}
              onMouseLeave={(e) => { e.target.style.color = '#C9A84C' }}
            >
              Pexels
            </a>
            {' or '}
            <a
              href="https://picsum.photos"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#C9A84C',
                textDecoration: 'underline',
                margin: '0 4px',
              }}
              onMouseEnter={(e) => { e.target.style.color = 'white' }}
              onMouseLeave={(e) => { e.target.style.color = '#C9A84C' }}
            >
              Picsum
            </a>
            . Right click any image → &quot;Copy image address&quot; → paste it here.
          </p>
          <button
            type="button"
            onClick={handleSaveAbout}
            disabled={saving === 'about'}
            className="px-4 py-2 bg-[#C9A84C] text-[#0D0D0D] font-semibold rounded hover:bg-[#D4B85C] transition-colors duration-200 disabled:opacity-50"
          >
            {saving === 'about' ? 'Saving...' : 'Save'}
          </button>
        </div>
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
