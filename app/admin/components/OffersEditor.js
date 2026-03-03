'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('volta_admin_token') : null
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export default function OffersEditor() {
  const router = useRouter()
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [toast, setToast] = useState(null)

  const fetchOffers = () => {
    fetch('/api/offers?all=true', { headers: getAuthHeaders() })
      .then((res) => {
        if (res.status === 401) {
          router.push('/admin/login')
          throw new Error('Unauthorized')
        }
        if (!res.ok) throw new Error('Failed to load')
        return res.json()
      })
      .then((data) => setOffers(Array.isArray(data) ? data : []))
      .catch(() => setOffers([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchOffers()
  }, [router])

  const showToast = (message, type) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#F5ECD7]">Manage Offers</h2>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-[#C9A84C] text-[#0D0D0D] font-semibold rounded hover:bg-[#D4B85C] transition-colors duration-200"
        >
          {showAddForm ? 'Cancel' : 'Add New Offer'}
        </button>
      </div>

      {showAddForm && (
        <AddOfferForm
          onUnauthorized={() => router.push('/admin/login')}
          onSave={() => {
            fetchOffers()
            setShowAddForm(false)
            showToast('Offer added!', 'success')
          }}
          onCancel={() => setShowAddForm(false)}
          onError={(msg) => showToast(msg, 'error')}
        />
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map((offer) => (
            <OfferCard
              key={offer._id}
              offer={offer}
              isEditing={editingId === offer._id}
              onEdit={() => setEditingId(editingId === offer._id ? null : offer._id)}
              onUnauthorized={() => router.push('/admin/login')}
              onToggle={() => {
                fetch('/api/offers', {
                  method: 'PUT',
                  headers: getAuthHeaders(),
                  body: JSON.stringify({ ...offer, active: !offer.active }),
                })
                  .then((res) => {
                    if (res.status === 401) router.push('/admin/login')
                    else if (res.ok) fetchOffers()
                  })
                  .catch(() => {})
              }}
              onDelete={() => {
                if (window.confirm(`Delete "${offer.title}"?`)) {
                  fetch(`/api/offers?id=${offer._id}`, {
                    method: 'DELETE',
                    headers: getAuthHeaders(),
                  })
                    .then((res) => {
                      if (res.status === 401) router.push('/admin/login')
                      else if (res.ok) {
                        fetchOffers()
                        showToast('Offer deleted', 'success')
                      } else {
                        showToast('Failed to delete', 'error')
                      }
                    })
                    .catch(() => showToast('Failed to delete', 'error'))
                }
              }}
              onSave={() => {
                fetchOffers()
                setEditingId(null)
                showToast('Saved successfully!', 'success')
              }}
              onError={(msg) => showToast(msg, 'error')}
            />
          ))}
        </div>
      )}

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

function AddOfferForm({ onSave, onCancel, onError, onUnauthorized }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [badge, setBadge] = useState('NEW')
  const [discountPercentage, setDiscountPercentage] = useState(0)
  const [active, setActive] = useState(true)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      onError('Title and description are required')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          badge: badge.trim() || 'NEW',
          discountPercentage: Number(discountPercentage) || 0,
          active,
        }),
      })
      if (res.status === 401) {
        onUnauthorized?.()
        return
      }
      if (!res.ok) {
        let errMsg = 'Failed to add'
        try {
          const err = await res.json()
          errMsg = err.error || err.message || errMsg
        } catch {
          errMsg = 'Failed to add'
        }
        throw new Error(errMsg)
      }
      onSave()
    } catch (err) {
      onError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-[#F5ECD7] mb-4">Add New Offer</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-[#F5ECD7] text-sm mb-2">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded text-[#F5ECD7] focus:border-[#C9A84C] focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[#F5ECD7] text-sm mb-2">Badge</label>
          <input
            type="text"
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            placeholder="NEW"
            className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded text-[#F5ECD7] focus:border-[#C9A84C] focus:outline-none"
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-[#F5ECD7] text-sm mb-2">Description *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded text-[#F5ECD7] focus:border-[#C9A84C] focus:outline-none resize-none"
        />
      </div>
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div>
          <label className="block text-[#F5ECD7] text-sm mb-2">Discount %</label>
          <input
            type="number"
            min={0}
            max={100}
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            className="w-24 px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded text-[#F5ECD7] focus:border-[#C9A84C] focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[#F5ECD7] text-sm">Active</label>
          <button
            type="button"
            onClick={() => setActive(!active)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              active ? 'bg-[#C9A84C]' : 'bg-[#2A2A2A]'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
                active ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-[#C9A84C] text-[#0D0D0D] font-semibold rounded hover:bg-[#D4B85C] disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-[#2A2A2A] text-[#F5ECD7] rounded hover:border-[#C9A84C] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

function OfferCard({ offer, isEditing, onEdit, onToggle, onDelete, onSave, onError, onUnauthorized }) {
  const [title, setTitle] = useState(offer.title)
  const [description, setDescription] = useState(offer.description)
  const [badge, setBadge] = useState(offer.badge || 'NEW')
  const [discountPercentage, setDiscountPercentage] = useState(offer.discountPercentage ?? 0)
  const [active, setActive] = useState(offer.active ?? true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEditing) {
      setTitle(offer.title)
      setDescription(offer.description)
      setBadge(offer.badge || 'NEW')
      setDiscountPercentage(offer.discountPercentage ?? 0)
      setActive(offer.active ?? true)
    }
  }, [isEditing, offer])

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      onError('Title and description are required')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/offers', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          _id: offer._id,
          title: title.trim(),
          description: description.trim(),
          badge: badge.trim() || 'NEW',
          discountPercentage: Number(discountPercentage) || 0,
          active,
        }),
      })
      if (res.status === 401) {
        onUnauthorized?.()
        return
      }
      if (!res.ok) {
        let errMsg = 'Failed to save'
        try {
          const err = await res.json()
          errMsg = err.error || err.message || errMsg
        } catch {
          errMsg = 'Failed to save'
        }
        throw new Error(errMsg)
      }
      onSave()
    } catch (err) {
      onError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6">
      {!isEditing ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-[#F5ECD7]">{offer.title}</h3>
              <span className="px-2 py-0.5 text-xs font-bold bg-[#C9A84C] text-[#0D0D0D] rounded">
                {offer.badge || 'NEW'}
              </span>
              <span className="text-[#F5ECD7]/70 text-sm">
                {offer.discountPercentage ?? 0}% off
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onToggle}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  offer.active ? 'bg-[#C9A84C]' : 'bg-[#2A2A2A]'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white ${
                    offer.active ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
              <span className="text-sm text-[#F5ECD7]/70">
                {offer.active ? 'Active' : 'Inactive'}
              </span>
              <button
                type="button"
                onClick={onEdit}
                className="px-3 py-1 border border-[#C9A84C] text-[#C9A84C] rounded hover:bg-[#C9A84C]/20 transition-colors text-sm"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="px-3 py-1 bg-[#EF4444] text-white rounded hover:bg-[#DC2626] transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          </div>
          <p className="text-[#F5ECD7]/80 mt-2">{offer.description}</p>
        </>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#F5ECD7]">Edit Offer</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#F5ECD7] text-sm mb-2">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded text-[#F5ECD7] focus:border-[#C9A84C] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[#F5ECD7] text-sm mb-2">Badge</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded text-[#F5ECD7] focus:border-[#C9A84C] focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-[#F5ECD7] text-sm mb-2">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded text-[#F5ECD7] focus:border-[#C9A84C] focus:outline-none resize-none"
            />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-[#F5ECD7] text-sm mb-2">Discount %</label>
              <input
                type="number"
                min={0}
                max={100}
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                className="w-24 px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded text-[#F5ECD7] focus:border-[#C9A84C] focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[#F5ECD7] text-sm">Active</label>
              <button
                type="button"
                onClick={() => setActive(!active)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  active ? 'bg-[#C9A84C]' : 'bg-[#2A2A2A]'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
                    active ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-[#C9A84C] text-[#0D0D0D] font-semibold rounded hover:bg-[#D4B85C] disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => onEdit()}
              className="px-4 py-2 border border-[#2A2A2A] text-[#F5ECD7] rounded hover:border-[#C9A84C] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
